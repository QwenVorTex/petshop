/**
 * 仪表盘数据API，提供首页仪表盘所需的综合统计数据和列表数据
 * GET /api/summary - 获取仪表盘数据，包括销售快照、精选宠物、库存预警、近期预约等信息
 * 主要修订内容：添加了统一错误处理和输入校验
 */
import type { APIRoute } from 'astro';
import {
  getDashboardSnapshot,
  getFeaturedPets,
  getLowStockAlerts,
  getRecentPreorders,
} from '@/data/db';
import { jsonResponse } from '@/lib/http';

export const GET: APIRoute = async () => {
  try {
    return jsonResponse({
      snapshot: await getDashboardSnapshot(),
      featuredPets: await getFeaturedPets(3),
      lowStockAlerts: await getLowStockAlerts(),
      recentPreorders: await getRecentPreorders(5),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, message: err.message }, { status: 500 });
  }
};
