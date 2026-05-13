/**
 * 库存数据API，支持获取库存列表和相关统计数据、添加新库存记录、更新库存信息、删除库存记录等操作
 * GET /api/inventory - 获取库存列表和相关统计数据
 * POST /api/inventory - 添加新库存记录
 * PUT /api/inventory - 更新库存信息
 * DELETE /api/inventory - 删除库存记录
 * 主要修订内容：添加了统一错误处理和输入校验
 */
import type { APIRoute } from 'astro';
import pool, {
  getInventoryOverview,
  getLowStockAlerts,
  getPetInventoryView,
  getWarehouseSummary,
} from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory ORDER BY updated_at DESC') as any;
    const inventory = rows.map((row: any) => ({
      inventoryId: row.inventory_id,
      petId: row.pet_id,
      categoryName: row.category_name,
      quantity: row.quantity,
      warehouseLocation: row.warehouse_location,
      cageCount: row.cage_count,
      updatedAt: row.updated_at,
    }));

    return jsonResponse({
      overview: await getInventoryOverview(),
      inventory,
      alerts: await getLowStockAlerts(),
      warehouses: await getWarehouseSummary(),
      inventoryView: await getPetInventoryView(),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.petId || !body.categoryName || body.quantity == null) {
      return jsonResponse({ success: false, message: '缺少必填字段：petId、categoryName、quantity' }, { status: 400 });
    }
    const [result] = await pool.query(
      'INSERT INTO inventory (pet_id, category_name, quantity, warehouse_location, cage_count) VALUES (?, ?, ?, ?, ?)',
      [body.petId, body.categoryName, body.quantity, body.warehouseLocation || null, body.cageCount || 0]
    ) as any;
    return jsonResponse({ success: true, inventoryId: result.insertId });
  } catch (err: any) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return jsonResponse({ success: false, message: '指定的宠物不存在' }, { status: 400 });
    }
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.inventoryId) {
      return jsonResponse({ success: false, message: '缺少必填字段：inventoryId' }, { status: 400 });
    }
    await pool.query(
      'UPDATE inventory SET pet_id=?, category_name=?, quantity=?, warehouse_location=?, cage_count=? WHERE inventory_id=?',
      [body.petId, body.categoryName, body.quantity, body.warehouseLocation, body.cageCount, body.inventoryId]
    );
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.inventoryId) {
      return jsonResponse({ success: false, message: '缺少必填字段：inventoryId' }, { status: 400 });
    }
    await pool.query('DELETE FROM inventory WHERE inventory_id=?', [body.inventoryId]);
    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
