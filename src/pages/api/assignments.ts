import type { APIRoute } from 'astro';
import pool from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT
        epm.employee_id, epm.pet_id, epm.manage_qty, epm.duty_note, epm.assigned_at,
        e.employee_name,
        p.pet_name, p.pet_species
      FROM employee_pet_manage epm
      LEFT JOIN employee e ON epm.employee_id = e.employee_id
      LEFT JOIN pet p ON epm.pet_id = p.pet_id
      ORDER BY epm.assigned_at DESC
    `) as any;

    const assignments = rows.map((row: any) => ({
      employeeId: row.employee_id,
      petId: row.pet_id,
      manageQty: row.manage_qty,
      dutyNote: row.duty_note,
      assignedAt: row.assigned_at,
      employeeName: row.employee_name,
      petName: row.pet_name,
      petSpecies: row.pet_species,
    }));

    return jsonResponse({ assignments });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeId || !body.petId) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeId、petId' }, { status: 400 });
    }
    await pool.query(
      'INSERT INTO employee_pet_manage (employee_id, pet_id, manage_qty, duty_note) VALUES (?, ?, ?, ?)',
      [body.employeeId, body.petId, body.manageQty || 1, body.dutyNote || null]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return jsonResponse({ success: false, message: '该员工已被分配到此宠物' }, { status: 409 });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return jsonResponse({ success: false, message: '指定的员工或宠物不存在' }, { status: 400 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeId || !body.petId) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeId、petId' }, { status: 400 });
    }
    await pool.query(
      'UPDATE employee_pet_manage SET manage_qty=?, duty_note=? WHERE employee_id=? AND pet_id=?',
      [body.manageQty, body.dutyNote, body.employeeId, body.petId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.employeeId || !body.petId) {
      return jsonResponse({ success: false, message: '缺少必填字段：employeeId、petId' }, { status: 400 });
    }
    await pool.query(
      'DELETE FROM employee_pet_manage WHERE employee_id=? AND pet_id=?',
      [body.employeeId, body.petId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
