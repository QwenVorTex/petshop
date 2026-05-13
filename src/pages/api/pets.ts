/**
 * 宠物数据API，支持获取宠物列表、添加新宠物、更新宠物信息、删除宠物等操作
 * GET /api/pets - 获取宠物列表和相关统计数据
 * POST /api/pets - 添加新宠物
 * PUT /api/pets - 更新宠物信息
 * DELETE /api/pets - 删除宠物
 * 主要修订内容：1)添加了统一错误处理和输入校验
 *              2)优化了查询逻辑，支持分页和搜索功能
 */

import type { APIRoute } from 'astro';
import pool, {
  getFeaturedPets,
  getPetInventoryView,
  getPetStatusBreakdown,
  getSpeciesDistribution,
} from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async ({ url }) => {
  try {
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status') || '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 20));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: any[] = [];
    if (keyword) {
      conditions.push('(pet_name LIKE ? OR pet_species LIKE ? OR pet_color LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (status) {
      conditions.push('pet_status = ?');
      params.push(status);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM pet ${where}`, params
    ) as any;

    const [pets] = await pool.query(
      `SELECT * FROM pet ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    ) as any;

    const rows = pets.map((row: any) => ({
      petId: row.pet_id,
      petName: row.pet_name,
      petSpecies: row.pet_species,
      petColor: row.pet_color,
      petAge: row.pet_age,
      petPrice: Number(row.pet_price),
      petStatus: row.pet_status,
      createdAt: row.created_at,
    }));

    return jsonResponse({
      pets: rows,
      pagination: { page, pageSize, total: Number(total), totalPages: Math.ceil(Number(total) / pageSize) },
      featuredPets: await getFeaturedPets(6),
      inventoryView: await getPetInventoryView(),
      statusBreakdown: await getPetStatusBreakdown(),
      speciesDistribution: await getSpeciesDistribution(),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.petName || !body.petSpecies || body.petPrice == null) {
      return jsonResponse({ success: false, message: '缺少必填字段：petName、petSpecies、petPrice' }, { status: 400 });
    }
    const [result] = await pool.query(
      'INSERT INTO pet (pet_name, pet_species, pet_color, pet_age, pet_price, pet_status) VALUES (?, ?, ?, ?, ?, ?)',
      [body.petName, body.petSpecies, body.petColor || null, body.petAge || null, body.petPrice, body.petStatus || '在售']
    ) as any;
    return jsonResponse({ success: true, petId: result.insertId });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.petId) {
      return jsonResponse({ success: false, message: '缺少必填字段：petId' }, { status: 400 });
    }
    await pool.query(
      'UPDATE pet SET pet_name=?, pet_species=?, pet_color=?, pet_age=?, pet_price=?, pet_status=? WHERE pet_id=?',
      [body.petName, body.petSpecies, body.petColor, body.petAge, body.petPrice, body.petStatus, body.petId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.petId) {
      return jsonResponse({ success: false, message: '缺少必填字段：petId' }, { status: 400 });
    }
    await pool.query('DELETE FROM pet WHERE pet_id=?', [body.petId]);
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
