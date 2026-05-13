/**
 * 员工数据API，支持获取员工列表和分配工作统计数据、添加新员工、更新员工信息、删除员工等操作
 * GET /api/employees - 获取员工列表和分配工作统计数据
 * POST /api/employees - 添加新员工
 * PUT /api/employees - 更新员工信息
 * DELETE /api/employees - 删除员工
 * 主要修订内容：1)添加了统一错误处理和输入校验
 *              2)优化了查询逻辑，支持分页和搜索功能
 */
import type { APIRoute } from 'astro';
import pool, { getEmployeeAssignmentRows } from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async ({ url }) => {
  try {
    const keyword = url.searchParams.get('keyword') || '';
    const gender = url.searchParams.get('gender') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 20));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: any[] = [];
    if (keyword) {
      conditions.push('(employee_name LIKE ? OR phone LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (gender && ['男', '女'].includes(gender)) {
      conditions.push('gender = ?');
      params.push(gender);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM employee ${where}`, params
    ) as any;

    const [empRows] = await pool.query(
      `SELECT * FROM employee ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    ) as any;

    const employees = empRows.map((row: any) => ({
      employeeId: row.employee_id,
      employeeName: row.employee_name,
      gender: row.gender,
      phone: row.phone,
      salary: Number(row.salary),
      age: row.age,
      createdAt: row.created_at,
    }));

    const [assignRows] = await pool.query('SELECT * FROM employee_pet_manage ORDER BY assigned_at DESC') as any;
    const assignments = assignRows.map((row: any) => ({
      employeeId: row.employee_id,
      petId: row.pet_id,
      manageQty: row.manage_qty,
      dutyNote: row.duty_note,
      assignedAt: row.assigned_at,
    }));

    return jsonResponse({
      employees,
      pagination: { page, pageSize, total: Number(total), totalPages: Math.ceil(Number(total) / pageSize) },
      assignments,
      workload: await getEmployeeAssignmentRows(),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeName || !body.gender || body.salary == null) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeName、gender、salary' }, { status: 400 });
    }
    if (!['男', '女'].includes(body.gender)) {
      return jsonResponse({ success: false, message: 'gender 只能为 男 或 女' }, { status: 400 });
    }
    const [result] = await pool.query(
      'INSERT INTO employee (employee_name, gender, phone, salary, age) VALUES (?, ?, ?, ?, ?)',
      [body.employeeName, body.gender, body.phone || null, body.salary, body.age || null]
    ) as any;
    return jsonResponse({ success: true, employeeId: result.insertId });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return jsonResponse({ success: false, message: '手机号已存在' }, { status: 409 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeId) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeId' }, { status: 400 });
    }
    await pool.query(
      'UPDATE employee SET employee_name=?, gender=?, phone=?, salary=?, age=? WHERE employee_id=?',
      [body.employeeName, body.gender, body.phone, body.salary, body.age, body.employeeId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return jsonResponse({ success: false, message: '手机号已存在' }, { status: 409 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeId) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeId' }, { status: 400 });
    }
    await pool.query('DELETE FROM employee WHERE employee_id=?', [body.employeeId]);
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
