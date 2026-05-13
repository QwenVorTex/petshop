/**
 * 预约数据API，支持获取预约列表和相关统计数据、添加新预约、更新预约信息、删除预约等操作
 * GET /api/preorders - 获取预约列表和相关统计数据
 * POST /api/preorders - 添加新预约
 * PUT /api/preorders - 更新预约信息
 * DELETE /api/preorders - 删除预约
 * 主要修订内容：
 * POST 创建预约时用事务保证原子性：
 *  1. 校验顾客和宠物存在性
 *  2. 检查库存数量是否足够
 *  3. 创建预约记录
 *  4. 同步扣减库存并更新宠物状态为已预订
 * PUT 更新预约状态时：
 *  - 如果状态变更为已完成或已取消，自动将宠物状态恢复为在售（前提是当前状态为已预订）
 * GET 获取预约列表时，包含预约看板数据和近期预约数据，方便前端展示不同视图
 */
import type { APIRoute } from 'astro';
import pool, { getRecentPreorders, getReservationBoard } from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async ({ url }) => {
  try {
    const status = url.searchParams.get('status') || '';
    const keyword = url.searchParams.get('keyword') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 20));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: any[] = [];
    if (status) {
      conditions.push('pr.preorder_status = ?');
      params.push(status);
    }
    if (keyword) {
      conditions.push('(c.customer_name LIKE ? OR p.pet_name LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // 带搜索时 JOIN customer 和 pet，方便按名字筛选
    const baseJoin = `
      FROM preorder pr
      LEFT JOIN customer c ON pr.customer_id = c.customer_id
      LEFT JOIN pet p ON pr.pet_id = p.pet_id
    `;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total ${baseJoin} ${where}`, params
    ) as any;

    const [rows] = await pool.query(
      `SELECT pr.* ${baseJoin} ${where} ORDER BY pr.preorder_time DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    ) as any;

    const preorders = rows.map((row: any) => ({
      preorderId: row.preorder_id,
      customerId: row.customer_id,
      petId: row.pet_id,
      preorderQty: row.preorder_qty,
      preorderTime: row.preorder_time,
      preorderStatus: row.preorder_status,
      remark: row.remark,
    }));

    return jsonResponse({
      preorders,
      pagination: { page, pageSize, total: Number(total), totalPages: Math.ceil(Number(total) / pageSize) },
      board: await getReservationBoard(),
      recent: await getRecentPreorders(6),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const conn = await pool.getConnection();
  try {
    const body = await request.json();
    if (!body.customerId || !body.petId) {
      conn.release();
      return jsonResponse({ success: false, message: '缺少必填字段：customerId、petId' }, { status: 400 });
    }

    await conn.beginTransaction();

    // 校验顾客是否存在
    const [[customer]] = await conn.query('SELECT customer_id FROM customer WHERE customer_id=?', [body.customerId]) as any;
    if (!customer) {
      await conn.rollback();
      conn.release();
      return jsonResponse({ success: false, message: '指定的顾客不存在' }, { status: 400 });
    }

    // 校验宠物是否存在并检查库存
    const [[pet]] = await conn.query('SELECT pet_id, pet_status FROM pet WHERE pet_id=?', [body.petId]) as any;
    if (!pet) {
      await conn.rollback();
      conn.release();
      return jsonResponse({ success: false, message: '指定的宠物不存在' }, { status: 400 });
    }
    if (pet.pet_status === '已售出') {
      await conn.rollback();
      conn.release();
      return jsonResponse({ success: false, message: '该宠物已售出，无法预约' }, { status: 409 });
    }

    // 检查库存数量是否足够
    const [[inv]] = await conn.query('SELECT quantity FROM inventory WHERE pet_id=?', [body.petId]) as any;
    const qty = body.preorderQty || 1;
    if (inv && inv.quantity < qty) {
      await conn.rollback();
      conn.release();
      return jsonResponse({ success: false, message: `库存不足，当前库存：${inv.quantity}` }, { status: 409 });
    }

    // 创建预约
    const [result] = await conn.query(
      'INSERT INTO preorder (customer_id, pet_id, preorder_qty, preorder_status, remark) VALUES (?, ?, ?, ?, ?)',
      [body.customerId, body.petId, qty, body.preorderStatus || '已预约', body.remark || null]
    ) as any;

    // 同步扣减库存并更新宠物状态为已预订
    if (inv) {
      await conn.query('UPDATE inventory SET quantity = quantity - ? WHERE pet_id=?', [qty, body.petId]);
    }
    await conn.query("UPDATE pet SET pet_status='已预订' WHERE pet_id=?", [body.petId]);

    await conn.commit();
    conn.release();
    return jsonResponse({ success: true, preorderId: result.insertId });
  } catch (err: any) {
    await conn.rollback();
    conn.release();
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const conn = await pool.getConnection();
  try {
    const body = await request.json();
    if (!body.preorderId) {
      conn.release();
      return jsonResponse({ success: false, message: '缺少必填字段：preorderId' }, { status: 400 });
    }

    const validStatuses = ['已预约', '待到店', '已完成', '已取消'];
    if (body.preorderStatus && !validStatuses.includes(body.preorderStatus)) {
      conn.release();
      return jsonResponse({ success: false, message: `preorderStatus 只能为：${validStatuses.join('、')}` }, { status: 400 });
    }

    await conn.beginTransaction();

    // 先取出当前预约，获取原始 petId 和 qty（body 里的 petId 可能已被修改）
    const [[current]] = await conn.query(
      'SELECT pet_id, preorder_qty FROM preorder WHERE preorder_id=?',
      [body.preorderId]
    ) as any;
    if (!current) {
      await conn.rollback();
      conn.release();
      return jsonResponse({ success: false, message: '预约记录不存在' }, { status: 404 });
    }

    await conn.query(
      'UPDATE preorder SET customer_id=?, pet_id=?, preorder_qty=?, preorder_status=?, remark=? WHERE preorder_id=?',
      [body.customerId, body.petId, body.preorderQty, body.preorderStatus, body.remark, body.preorderId]
    );

    if (body.preorderStatus === '已取消') {
      // 取消：恢复库存数量，宠物改回在售
      await conn.query(
        'UPDATE inventory SET quantity = quantity + ? WHERE pet_id=?',
        [current.preorder_qty, current.pet_id]
      );
      await conn.query(
        "UPDATE pet SET pet_status='在售' WHERE pet_id=? AND pet_status='已预订'",
        [current.pet_id]
      );
    } else if (body.preorderStatus === '已完成') {
      // 完成：宠物标记为已售出（库存已在创建预约时扣减，不再归还）
      await conn.query(
        "UPDATE pet SET pet_status='已售出' WHERE pet_id=?",
        [current.pet_id]
      );
    }

    await conn.commit();
    conn.release();
    return jsonResponse({ success: true });
  } catch (err: any) {
    await conn.rollback();
    conn.release();
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.preorderId) {
      return jsonResponse({ success: false, message: '缺少必填字段：preorderId' }, { status: 400 });
    }
    await pool.query('DELETE FROM preorder WHERE preorder_id=?', [body.preorderId]);
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
