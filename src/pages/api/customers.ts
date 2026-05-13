/**
 * 顾客数据API，支持获取顾客列表和预约统计数据、添加新顾客、更新顾客信息、删除顾客等操作
 * GET /api/customers - 获取顾客列表和预约统计数据
 * POST /api/customers - 添加新顾客
 * PUT /api/customers - 更新顾客信息
 * DELETE /api/customers - 删除顾客
 * 主要修订内容：1)添加了统一错误处理和输入校验
 *              2)优化了查询逻辑，支持分页和搜索功能
 */
import type { APIRoute } from 'astro';
import pool, { getCustomerReservationRows } from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async ({ url }) => {
  try {
    const keyword = url.searchParams.get('keyword') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 20));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: any[] = [];
    if (keyword) {
      conditions.push('(customer_name LIKE ? OR phone LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM customer ${where}`, params
    ) as any;

    const [rows] = await pool.query(
      `SELECT * FROM customer ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    ) as any;

    const customers = rows.map((row: any) => ({
      customerId: row.customer_id,
      customerName: row.customer_name,
      phone: row.phone,
      idCard: row.id_card,
      createdAt: row.created_at,
    }));

    return jsonResponse({
      customers,
      pagination: { page, pageSize, total: Number(total), totalPages: Math.ceil(Number(total) / pageSize) },
      reservations: await getCustomerReservationRows(),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.customerName || !body.phone || !body.idCard) {
      return jsonResponse({ success: false, message: '缺少必填字段：customerName、phone、idCard' }, { status: 400 });
    }
    const [result] = await pool.query(
      'INSERT INTO customer (customer_name, phone, id_card) VALUES (?, ?, ?)',
      [body.customerName, body.phone, body.idCard]
    ) as any;
    return jsonResponse({ success: true, customerId: result.insertId });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return jsonResponse({ success: false, message: '手机号或身份证号已存在' }, { status: 409 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.customerId) {
      return jsonResponse({ success: false, message: '缺少必填字段：customerId' }, { status: 400 });
    }
    await pool.query(
      'UPDATE customer SET customer_name=?, phone=?, id_card=? WHERE customer_id=?',
      [body.customerName, body.phone, body.idCard, body.customerId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return jsonResponse({ success: false, message: '手机号或身份证号已存在' }, { status: 409 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.customerId) {
      return jsonResponse({ success: false, message: '缺少必填字段：customerId' }, { status: 400 });
    }
    await pool.query('DELETE FROM customer WHERE customer_id=?', [body.customerId]);
    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return jsonResponse({ success: false, message: '该顾客存在关联预约，请先删除预约记录' }, { status: 409 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
