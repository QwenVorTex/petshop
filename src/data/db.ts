/**
 * 数据库连接与查询模块
 * 替换 mock.ts，提供完全相同的导出接口，但数据来自真实 MySQL 数据库
 */
import mysql from 'mysql2/promise';

// ============ 数据库连接池 ============

const pool = mysql.createPool({
  host: import.meta.env.DB_HOST || 'localhost',
  port: Number(import.meta.env.DB_PORT) || 3306,
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME || 'petshop_db',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;

// ============ 类型定义（和 mock.ts 保持一致） ============

export type PetStatus = '在售' | '已预订' | '观察中' | '已售出';
export type PreorderStatus = '已预约' | '待到店' | '已完成' | '已取消';

export interface Customer {
  customerId: number;
  customerName: string;
  phone: string;
  idCard: string;
  createdAt: string;
}

export interface Employee {
  employeeId: number;
  employeeName: string;
  gender: '男' | '女';
  phone: string;
  salary: number;
  age: number;
  createdAt: string;
}

export interface Pet {
  petId: number;
  petName: string;
  petSpecies: string;
  petColor: string;
  petAge: number;
  petPrice: number;
  petStatus: PetStatus;
  createdAt: string;
}

export interface InventoryRecord {
  inventoryId: number;
  petId: number;
  categoryName: string;
  quantity: number;
  warehouseLocation: string;
  cageCount: number;
  updatedAt: string;
}

export interface Preorder {
  preorderId: number;
  customerId: number;
  petId: number;
  preorderQty: number;
  preorderTime: string;
  preorderStatus: PreorderStatus;
  remark: string;
}

export interface EmployeePetManage {
  employeeId: number;
  petId: number;
  manageQty: number;
  dutyNote: string;
  assignedAt: string;
}

// ============ 工具函数：把 MySQL snake_case 结果转为 camelCase ============

function toCamel(row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = row[key];
  }
  return result;
}

function rowsToCamel(rows: any[]): any[] {
  return rows.map(toCamel);
}

// ============ 12 个查询函数（和 mock.ts 导出名称完全一致） ============

export async function getDashboardSnapshot() {
  const [[petStats]] = await pool.query(`
    SELECT
      COUNT(*) AS petCount,
      SUM(CASE WHEN pet_status = '在售' THEN 1 ELSE 0 END) AS petsOnSale,
      SUM(CASE WHEN pet_status = '已预订' THEN 1 ELSE 0 END) AS reservedPets,
      ROUND(AVG(pet_price)) AS averagePetPrice
    FROM pet
  `) as any;

  const [[employeeStats]] = await pool.query(`
    SELECT COUNT(*) AS employeeCount, SUM(salary) AS monthlyPayroll
    FROM employee
  `) as any;

  const [[customerStats]] = await pool.query(`
    SELECT COUNT(*) AS customerCount FROM customer
  `) as any;

  const [[preorderStats]] = await pool.query(`
    SELECT
      SUM(CASE WHEN preorder_status IN ('已预约','待到店') THEN 1 ELSE 0 END) AS pendingPreorders,
      SUM(CASE WHEN preorder_status = '已完成' THEN 1 ELSE 0 END) AS completedPreorders
    FROM preorder
  `) as any;

  const [[activeCustomerStats]] = await pool.query(`
    SELECT COUNT(DISTINCT customer_id) AS activeCustomerCount
    FROM preorder
    WHERE preorder_status IN ('已预约','待到店')
  `) as any;

  const [[inventoryStats]] = await pool.query(`
    SELECT
      SUM(quantity) AS totalInventory,
      COUNT(DISTINCT category_name) AS categoryCount
    FROM inventory
  `) as any;

  const lowStockCount = (await getLowStockAlerts()).length;

  return {
    customerCount: Number(customerStats.customerCount),
    employeeCount: Number(employeeStats.employeeCount),
    petCount: Number(petStats.petCount),
    petsOnSale: Number(petStats.petsOnSale),
    reservedPets: Number(petStats.reservedPets),
    pendingPreorders: Number(preorderStats.pendingPreorders),
    completedPreorders: Number(preorderStats.completedPreorders),
    lowStockCount,
    monthlyPayroll: Number(employeeStats.monthlyPayroll),
    averagePetPrice: Number(petStats.averagePetPrice),
    totalInventory: Number(inventoryStats.totalInventory),
    categoryCount: Number(inventoryStats.categoryCount),
    activeCustomerCount: Number(activeCustomerStats.activeCustomerCount),
  };
}

export async function getFeaturedPets(limit = 6) {
  const [rows] = await pool.query(`
    SELECT
      p.pet_id, p.pet_name, p.pet_species, p.pet_color,
      p.pet_age, p.pet_price, p.pet_status, p.created_at,
      MAX(i.inventory_id) AS inventory_id,
      MAX(i.category_name) AS category_name,
      MAX(i.quantity) AS quantity,
      MAX(i.warehouse_location) AS warehouse_location,
      MAX(i.cage_count) AS cage_count,
      MAX(i.updated_at) AS inventory_updated_at,
      GROUP_CONCAT(e.employee_name SEPARATOR ' / ') AS managers
    FROM pet p
    LEFT JOIN inventory i ON p.pet_id = i.pet_id
    LEFT JOIN employee_pet_manage epm ON p.pet_id = epm.pet_id
    LEFT JOIN employee e ON epm.employee_id = e.employee_id
    WHERE p.pet_status != '已售出'
    GROUP BY p.pet_id, p.pet_name, p.pet_species, p.pet_color,
             p.pet_age, p.pet_price, p.pet_status, p.created_at
    ORDER BY p.pet_price DESC
    LIMIT ?
  `, [limit]) as any;

  return rows.map((row: any) => ({
    petId: row.pet_id,
    petName: row.pet_name,
    petSpecies: row.pet_species,
    petColor: row.pet_color,
    petAge: row.pet_age,
    petPrice: Number(row.pet_price),
    petStatus: row.pet_status,
    createdAt: row.created_at,
    inventory: row.inventory_id ? {
      inventoryId: row.inventory_id,
      petId: row.pet_id,
      categoryName: row.category_name,
      quantity: row.quantity,
      warehouseLocation: row.warehouse_location,
      cageCount: row.cage_count,
      updatedAt: row.inventory_updated_at,
    } : undefined,
    managers: row.managers || '待分配',
  }));
}

export async function getPetInventoryView() {
  const [rows] = await pool.query(`
    SELECT
      p.pet_id, p.pet_name, p.pet_species, p.pet_color,
      p.pet_price, p.pet_status,
      COALESCE(i.category_name, '未分类') AS category_name,
      COALESCE(i.quantity, 0) AS quantity,
      COALESCE(i.warehouse_location, '未安排') AS warehouse_location,
      COALESCE(i.cage_count, 0) AS cage_count,
      COALESCE(i.updated_at, p.created_at) AS updated_at
    FROM pet p
    LEFT JOIN inventory i ON p.pet_id = i.pet_id
  `) as any;

  return rows.map((row: any) => ({
    petId: row.pet_id,
    petName: row.pet_name,
    petSpecies: row.pet_species,
    petColor: row.pet_color,
    petPrice: Number(row.pet_price),
    petStatus: row.pet_status,
    categoryName: row.category_name,
    quantity: row.quantity,
    warehouseLocation: row.warehouse_location,
    cageCount: row.cage_count,
    updatedAt: row.updated_at,
  }));
}

export async function getSpeciesDistribution() {
  const [rows] = await pool.query(`
    SELECT
      pet_species AS species,
      COUNT(*) AS count,
      SUM(pet_price) AS totalValue
    FROM pet
    GROUP BY pet_species
    ORDER BY count DESC, totalValue DESC
  `) as any;

  return rows.map((row: any) => ({
    species: row.species,
    count: Number(row.count),
    totalValue: Number(row.totalValue),
  }));
}

export async function getPetStatusBreakdown() {
  const order: PetStatus[] = ['在售', '已预订', '观察中', '已售出'];
  const [rows] = await pool.query(`
    SELECT pet_status, COUNT(*) AS count
    FROM pet
    GROUP BY pet_status
  `) as any;

  const countMap = new Map(rows.map((r: any) => [r.pet_status, Number(r.count)]));
  return order.map((status) => ({
    status,
    count: countMap.get(status) || 0,
  }));
}

export async function getLowStockAlerts() {
  const [rows] = await pool.query(`
    SELECT
      i.inventory_id, i.pet_id, i.quantity, i.cage_count,
      i.warehouse_location, i.category_name, i.updated_at,
      COALESCE(p.pet_name, '未知宠物') AS pet_name,
      COALESCE(p.pet_species, '未知品种') AS pet_species
    FROM inventory i
    LEFT JOIN pet p ON i.pet_id = p.pet_id
    WHERE i.quantity <= 1 OR i.cage_count <= 1
    ORDER BY i.quantity ASC, i.cage_count ASC
  `) as any;

  return rows.map((row: any) => ({
    inventoryId: row.inventory_id,
    petId: row.pet_id,
    petName: row.pet_name,
    petSpecies: row.pet_species,
    quantity: row.quantity,
    cageCount: row.cage_count,
    warehouseLocation: row.warehouse_location,
    categoryName: row.category_name,
    updatedAt: row.updated_at,
  }));
}

export async function getInventoryOverview() {
  const [[row]] = await pool.query(`
    SELECT
      SUM(quantity) AS totalQuantity,
      SUM(cage_count) AS totalCages,
      COUNT(DISTINCT warehouse_location) AS warehouseCount
    FROM inventory
  `) as any;

  const lowStockCount = (await getLowStockAlerts()).length;

  return {
    totalQuantity: Number(row.totalQuantity),
    totalCages: Number(row.totalCages),
    lowStockCount,
    warehouseCount: Number(row.warehouseCount),
  };
}

export async function getWarehouseSummary() {
  const [rows] = await pool.query(`
    SELECT
      warehouse_location,
      COUNT(*) AS petCount,
      SUM(quantity) AS quantity,
      SUM(cage_count) AS cageCount,
      COUNT(DISTINCT category_name) AS categoryCount
    FROM inventory
    GROUP BY warehouse_location
    ORDER BY warehouse_location
  `) as any;

  return rows.map((row: any) => ({
    warehouseLocation: row.warehouse_location,
    petCount: Number(row.petCount),
    quantity: Number(row.quantity),
    cageCount: Number(row.cageCount),
    categoryCount: Number(row.categoryCount),
  }));
}

export async function getRecentPreorders(limit = 6) {
  const [rows] = await pool.query(`
    SELECT
      pr.preorder_id, pr.preorder_qty, pr.preorder_time,
      pr.preorder_status, pr.remark,
      COALESCE(c.customer_name, '未知顾客') AS customer_name,
      COALESCE(p.pet_name, '未知宠物') AS pet_name,
      COALESCE(p.pet_species, '未知品种') AS pet_species,
      COALESCE(p.pet_price, 0) AS pet_price
    FROM preorder pr
    LEFT JOIN customer c ON pr.customer_id = c.customer_id
    LEFT JOIN pet p ON pr.pet_id = p.pet_id
    ORDER BY pr.preorder_time DESC
    LIMIT ?
  `, [limit]) as any;

  return rows.map((row: any) => ({
    preorderId: row.preorder_id,
    customerName: row.customer_name,
    petName: row.pet_name,
    petSpecies: row.pet_species,
    petPrice: Number(row.pet_price),
    preorderQty: row.preorder_qty,
    preorderTime: row.preorder_time,
    preorderStatus: row.preorder_status,
    remark: row.remark,
  }));
}
/**
 * 预约看板数据，按照预约状态分组，每组包含对应的预约记录列表
 * 预约记录包含顾客姓名、宠物信息、预约数量、时间、备注等字段
   修改：
   问题描述：之前调用 getRecentPreorders(1000) ，是硬编码上限
   修改：改为独立SQL查询 ，没有数量限制*/
export async function getReservationBoard() {
  const order: PreorderStatus[] = ['已预约', '待到店', '已完成', '已取消'];

  const [rows] = await pool.query(`
    SELECT
      pr.preorder_id, pr.preorder_qty, pr.preorder_time,
      pr.preorder_status, pr.remark,
      COALESCE(c.customer_name, '未知顾客') AS customer_name,
      COALESCE(p.pet_name, '未知宠物') AS pet_name,
      COALESCE(p.pet_species, '未知品种') AS pet_species,
      COALESCE(p.pet_price, 0) AS pet_price
    FROM preorder pr
    LEFT JOIN customer c ON pr.customer_id = c.customer_id
    LEFT JOIN pet p ON pr.pet_id = p.pet_id
    ORDER BY pr.preorder_time DESC
  `) as any;

  const allItems = rows.map((row: any) => ({
    preorderId: row.preorder_id,
    customerName: row.customer_name,
    petName: row.pet_name,
    petSpecies: row.pet_species,
    petPrice: Number(row.pet_price),
    preorderQty: row.preorder_qty,
    preorderTime: row.preorder_time,
    preorderStatus: row.preorder_status,
    remark: row.remark,
  }));

  return order.map((status) => ({
    status,
    items: allItems.filter((item: any) => item.preorderStatus === status),
  }));
}

/**
 * 顾客预约关系表格数据，包含顾客基本信息和预约统计字段
 * 预约统计字段包括：总预约数、活跃预约数（已预约/待到店）、最后预约时间、感兴趣宠物列表、已完成预约总价值、最新预约状态
   修改：
   问题描述：latestStatus 有预约时返回 undefined
   解决方法：加关联子查询取最新 preorder_status，无预约时显示“暂无预约” */
export async function getCustomerReservationRows() {
  const [rows] = await pool.query(`
    SELECT
      c.customer_id, c.customer_name, c.phone, c.id_card, c.created_at,
      COUNT(pr.preorder_id) AS reservationCount,
      SUM(CASE WHEN pr.preorder_status IN ('已预约','待到店') THEN 1 ELSE 0 END) AS activeReservationCount,
      MAX(pr.preorder_time) AS lastReservationTime,
      GROUP_CONCAT(DISTINCT p.pet_name SEPARATOR ' / ') AS interestedPets,
      SUM(CASE WHEN pr.preorder_status = '已完成' THEN p.pet_price ELSE 0 END) AS completedValue,
      (
        SELECT pr2.preorder_status
        FROM preorder pr2
        WHERE pr2.customer_id = c.customer_id
        ORDER BY pr2.preorder_time DESC
        LIMIT 1
      ) AS latestPreorderStatus
    FROM customer c
    LEFT JOIN preorder pr ON c.customer_id = pr.customer_id
    LEFT JOIN pet p ON pr.pet_id = p.pet_id
    GROUP BY c.customer_id, c.customer_name, c.phone, c.id_card, c.created_at
    ORDER BY lastReservationTime DESC
  `) as any;

  return rows.map((row: any) => ({
    customerId: row.customer_id,
    customerName: row.customer_name,
    phone: row.phone,
    idCard: row.id_card,
    createdAt: row.created_at,
    reservationCount: Number(row.reservationCount),
    activeReservationCount: Number(row.activeReservationCount),
    lastReservationTime: row.lastReservationTime || row.created_at,
    latestStatus: row.latestPreorderStatus || '暂无预约',
    interestedPets: row.interestedPets || '暂无记录',
    completedValue: Number(row.completedValue),
  }));
}

export async function getEmployeeAssignmentRows() {
  const [rows] = await pool.query(`
    SELECT
      e.employee_id, e.employee_name, e.gender, e.phone,
      e.salary, e.age, e.created_at,
      COUNT(epm.pet_id) AS managedPets,
      COALESCE(SUM(epm.manage_qty), 0) AS managedQty,
      MAX(epm.assigned_at) AS latestAssignment,
      GROUP_CONCAT(DISTINCT epm.duty_note SEPARATOR ' / ') AS dutySummary,
      GROUP_CONCAT(DISTINCT CONCAT(p.pet_name, '(', p.pet_species, ')') SEPARATOR ' / ') AS petLabels
    FROM employee e
    LEFT JOIN employee_pet_manage epm ON e.employee_id = epm.employee_id
    LEFT JOIN pet p ON epm.pet_id = p.pet_id
    GROUP BY e.employee_id
    ORDER BY managedQty DESC, e.salary DESC
  `) as any;

  return rows.map((row: any) => ({
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    gender: row.gender,
    phone: row.phone,
    salary: Number(row.salary),
    age: row.age,
    createdAt: row.created_at,
    managedPets: Number(row.managedPets),
    managedQty: Number(row.managedQty),
    latestAssignment: row.latestAssignment || row.created_at,
    dutySummary: row.dutySummary || '暂无分工',
    petLabels: row.petLabels || '暂无负责宠物',
  }));
}

// ============ 静态数据（不需要查数据库的） ============

export const schemaModules = [
  {
    table: 'customer',
    title: '顾客信息',
    description: '顾客基础信息和唯一联系方式，未来可直接承接会员等级、售后记录。',
    fields: ['customer_name', 'phone', 'id_card', 'created_at'],
  },
  {
    table: 'employee',
    title: '员工信息',
    description: '员工资料、薪资和年龄维度，当前已经映射到人员面板和工作负载视图。',
    fields: ['employee_name', 'gender', 'phone', 'salary', 'age'],
  },
  {
    table: 'pet',
    title: '宠物档案',
    description: '宠物名称、品种、颜色、年龄、价格和状态，是整个系统的核心实体。',
    fields: ['pet_name', 'pet_species', 'pet_color', 'pet_age', 'pet_price', 'pet_status'],
  },
  {
    table: 'inventory',
    title: '库存信息',
    description: '库存数量、仓位、笼位等运维字段，直接驱动库存预警页。',
    fields: ['category_name', 'quantity', 'warehouse_location', 'cage_count', 'updated_at'],
  },
  {
    table: 'preorder',
    title: '预约记录',
    description: '顾客与宠物之间的预订关系，当前映射为预约看板和时间线。',
    fields: ['customer_id', 'pet_id', 'preorder_qty', 'preorder_time', 'preorder_status'],
  },
  {
    table: 'employee_pet_manage',
    title: '员工管理关系',
    description: '员工负责宠物的数量与职责说明，用于生成工作负载和责任归属。',
    fields: ['employee_id', 'pet_id', 'manage_qty', 'duty_note', 'assigned_at'],
  },
] as const;

export const apiCatalog = [
  {
    name: '仪表盘汇总',
    path: '/api/summary',
    description: '返回首页使用的统计快照和关键指标。',
  },
  {
    name: '宠物清单',
    path: '/api/pets',
    description: '返回宠物档案、状态分布和高价值宠物。',
  },
  {
    name: '库存视图',
    path: '/api/inventory',
    description: '返回库存总览、低库存预警和 v_pet_inventory 风格的联表结果。',
  },
  {
    name: '顾客视图',
    path: '/api/customers',
    description: '返回顾客列表及其预约关系。',
  },
  {
    name: '员工视图',
    path: '/api/employees',
    description: '返回员工负载、工资汇总与宠物管理关系。',
  },
  {
    name: '预约看板',
    path: '/api/preorders',
    description: '返回预约状态分组和最近处理记录。',
  },
] as const;
