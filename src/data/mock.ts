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

export const customers: Customer[] = [
  {
    customerId: 1,
    customerName: '林夏微',
    phone: '13800010001',
    idCard: '440106199711230418',
    createdAt: '2026-03-03T10:15:00+08:00',
  },
  {
    customerId: 2,
    customerName: '周子昂',
    phone: '13800010002',
    idCard: '440104199501085437',
    createdAt: '2026-03-10T14:20:00+08:00',
  },
  {
    customerId: 3,
    customerName: '何雨晴',
    phone: '13800010003',
    idCard: '440113199904152726',
    createdAt: '2026-03-18T09:00:00+08:00',
  },
  {
    customerId: 4,
    customerName: '赵可可',
    phone: '13800010004',
    idCard: '440105200002113924',
    createdAt: '2026-04-02T11:30:00+08:00',
  },
  {
    customerId: 5,
    customerName: '唐若安',
    phone: '13800010005',
    idCard: '440106199808276618',
    createdAt: '2026-04-12T16:45:00+08:00',
  },
  {
    customerId: 6,
    customerName: '郭辰',
    phone: '13800010006',
    idCard: '440111199612063514',
    createdAt: '2026-04-18T19:05:00+08:00',
  },
];

export const employees: Employee[] = [
  {
    employeeId: 1,
    employeeName: '陈诺',
    gender: '男',
    phone: '13900020001',
    salary: 7800,
    age: 29,
    createdAt: '2026-01-11T09:00:00+08:00',
  },
  {
    employeeId: 2,
    employeeName: '方梨',
    gender: '女',
    phone: '13900020002',
    salary: 7200,
    age: 26,
    createdAt: '2026-01-14T10:00:00+08:00',
  },
  {
    employeeId: 3,
    employeeName: '马惠',
    gender: '女',
    phone: '13900020003',
    salary: 8100,
    age: 33,
    createdAt: '2026-02-01T09:30:00+08:00',
  },
  {
    employeeId: 4,
    employeeName: '许川',
    gender: '男',
    phone: '13900020004',
    salary: 6800,
    age: 24,
    createdAt: '2026-02-11T12:00:00+08:00',
  },
  {
    employeeId: 5,
    employeeName: '卢棠',
    gender: '女',
    phone: '13900020005',
    salary: 7600,
    age: 28,
    createdAt: '2026-02-23T15:20:00+08:00',
  },
];

export const pets: Pet[] = [
  {
    petId: 1,
    petName: '云朵',
    petSpecies: '柯基',
    petColor: '金白',
    petAge: 8,
    petPrice: 6800,
    petStatus: '在售',
    createdAt: '2026-03-01T10:30:00+08:00',
  },
  {
    petId: 2,
    petName: '糖糖',
    petSpecies: '布偶猫',
    petColor: '重点色',
    petAge: 6,
    petPrice: 5200,
    petStatus: '已预订',
    createdAt: '2026-03-05T13:10:00+08:00',
  },
  {
    petId: 3,
    petName: '土豆',
    petSpecies: '柴犬',
    petColor: '赤色',
    petAge: 10,
    petPrice: 5900,
    petStatus: '在售',
    createdAt: '2026-03-12T16:20:00+08:00',
  },
  {
    petId: 4,
    petName: '芝麻',
    petSpecies: '侏儒兔',
    petColor: '灰白',
    petAge: 4,
    petPrice: 1500,
    petStatus: '观察中',
    createdAt: '2026-03-20T09:40:00+08:00',
  },
  {
    petId: 5,
    petName: '果冻',
    petSpecies: '金渐层',
    petColor: '金色',
    petAge: 5,
    petPrice: 7200,
    petStatus: '在售',
    createdAt: '2026-03-25T17:05:00+08:00',
  },
  {
    petId: 6,
    petName: '七喜',
    petSpecies: '萨摩耶',
    petColor: '白色',
    petAge: 7,
    petPrice: 8600,
    petStatus: '已预订',
    createdAt: '2026-04-04T11:15:00+08:00',
  },
  {
    petId: 7,
    petName: '星尘',
    petSpecies: '银狐仓鼠',
    petColor: '银灰',
    petAge: 3,
    petPrice: 260,
    petStatus: '在售',
    createdAt: '2026-04-10T14:30:00+08:00',
  },
  {
    petId: 8,
    petName: '奶盖',
    petSpecies: '曼基康',
    petColor: '乳白',
    petAge: 4,
    petPrice: 9800,
    petStatus: '在售',
    createdAt: '2026-04-15T18:20:00+08:00',
  },
];

export const inventory: InventoryRecord[] = [
  {
    inventoryId: 1,
    petId: 1,
    categoryName: '犬类',
    quantity: 2,
    warehouseLocation: 'A-01',
    cageCount: 2,
    updatedAt: '2026-04-18T09:10:00+08:00',
  },
  {
    inventoryId: 2,
    petId: 2,
    categoryName: '猫类',
    quantity: 1,
    warehouseLocation: 'B-02',
    cageCount: 1,
    updatedAt: '2026-04-19T08:40:00+08:00',
  },
  {
    inventoryId: 3,
    petId: 3,
    categoryName: '犬类',
    quantity: 3,
    warehouseLocation: 'A-03',
    cageCount: 2,
    updatedAt: '2026-04-18T17:30:00+08:00',
  },
  {
    inventoryId: 4,
    petId: 4,
    categoryName: '小宠',
    quantity: 1,
    warehouseLocation: 'C-01',
    cageCount: 1,
    updatedAt: '2026-04-17T11:55:00+08:00',
  },
  {
    inventoryId: 5,
    petId: 5,
    categoryName: '猫类',
    quantity: 2,
    warehouseLocation: 'B-01',
    cageCount: 2,
    updatedAt: '2026-04-19T13:20:00+08:00',
  },
  {
    inventoryId: 6,
    petId: 6,
    categoryName: '犬类',
    quantity: 1,
    warehouseLocation: 'A-04',
    cageCount: 1,
    updatedAt: '2026-04-19T15:10:00+08:00',
  },
  {
    inventoryId: 7,
    petId: 7,
    categoryName: '小宠',
    quantity: 5,
    warehouseLocation: 'C-03',
    cageCount: 3,
    updatedAt: '2026-04-20T09:05:00+08:00',
  },
  {
    inventoryId: 8,
    petId: 8,
    categoryName: '猫类',
    quantity: 1,
    warehouseLocation: 'B-03',
    cageCount: 1,
    updatedAt: '2026-04-20T10:15:00+08:00',
  },
];

export const preorders: Preorder[] = [
  {
    preorderId: 1,
    customerId: 2,
    petId: 2,
    preorderQty: 1,
    preorderTime: '2026-04-13T10:20:00+08:00',
    preorderStatus: '待到店',
    remark: '客户希望周末完成最终确认。',
  },
  {
    preorderId: 2,
    customerId: 4,
    petId: 6,
    preorderQty: 1,
    preorderTime: '2026-04-18T12:10:00+08:00',
    preorderStatus: '已预约',
    remark: '已支付定金，等待第二次回访。',
  },
  {
    preorderId: 3,
    customerId: 1,
    petId: 5,
    preorderQty: 1,
    preorderTime: '2026-04-09T14:05:00+08:00',
    preorderStatus: '已完成',
    remark: '已完成交付，售后观察正常。',
  },
  {
    preorderId: 4,
    customerId: 6,
    petId: 8,
    preorderQty: 1,
    preorderTime: '2026-04-19T17:00:00+08:00',
    preorderStatus: '已预约',
    remark: '等待健康证明复核。',
  },
  {
    preorderId: 5,
    customerId: 3,
    petId: 1,
    preorderQty: 1,
    preorderTime: '2026-04-11T11:35:00+08:00',
    preorderStatus: '已取消',
    remark: '客户时间冲突，后续可能转购其他犬类。',
  },
];

export const employeePetManage: EmployeePetManage[] = [
  {
    employeeId: 1,
    petId: 1,
    manageQty: 1,
    dutyNote: '早班喂养和运动观察',
    assignedAt: '2026-04-03T09:00:00+08:00',
  },
  {
    employeeId: 2,
    petId: 2,
    manageQty: 1,
    dutyNote: '预约客户接待和日常梳理',
    assignedAt: '2026-04-04T09:00:00+08:00',
  },
  {
    employeeId: 3,
    petId: 5,
    manageQty: 1,
    dutyNote: '健康巡检和疫苗跟进',
    assignedAt: '2026-04-05T10:20:00+08:00',
  },
  {
    employeeId: 4,
    petId: 7,
    manageQty: 3,
    dutyNote: '小宠区清洁和库存记录',
    assignedAt: '2026-04-06T11:10:00+08:00',
  },
  {
    employeeId: 5,
    petId: 6,
    manageQty: 1,
    dutyNote: '待交付前的训练适应',
    assignedAt: '2026-04-08T16:00:00+08:00',
  },
  {
    employeeId: 1,
    petId: 8,
    manageQty: 1,
    dutyNote: '新到店猫舍适应观察',
    assignedAt: '2026-04-18T13:30:00+08:00',
  },
];

const customerById = new Map(customers.map((item) => [item.customerId, item]));
const employeeById = new Map(employees.map((item) => [item.employeeId, item]));
const petById = new Map(pets.map((item) => [item.petId, item]));
const inventoryByPetId = new Map(inventory.map((item) => [item.petId, item]));

const activePreorderStatuses = new Set<PreorderStatus>(['已预约', '待到店']);

export function getDashboardSnapshot() {
  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const monthlyPayroll = employees.reduce((sum, item) => sum + item.salary, 0);
  const averagePetPrice = Math.round(pets.reduce((sum, item) => sum + item.petPrice, 0) / pets.length);
  const pendingPreorders = preorders.filter((item) => activePreorderStatuses.has(item.preorderStatus)).length;
  const completedPreorders = preorders.filter((item) => item.preorderStatus === '已完成').length;
  const activeCustomerCount = new Set(
    preorders.filter((item) => activePreorderStatuses.has(item.preorderStatus)).map((item) => item.customerId),
  ).size;

  return {
    customerCount: customers.length,
    employeeCount: employees.length,
    petCount: pets.length,
    petsOnSale: pets.filter((item) => item.petStatus === '在售').length,
    reservedPets: pets.filter((item) => item.petStatus === '已预订').length,
    pendingPreorders,
    completedPreorders,
    lowStockCount: getLowStockAlerts().length,
    monthlyPayroll,
    averagePetPrice,
    totalInventory,
    categoryCount: new Set(inventory.map((item) => item.categoryName)).size,
    activeCustomerCount,
  };
}

export function getFeaturedPets(limit = 6) {
  return [...pets]
    .filter((item) => item.petStatus !== '已售出')
    .sort((a, b) => b.petPrice - a.petPrice)
    .slice(0, limit)
    .map((pet) => {
      const stock = inventoryByPetId.get(pet.petId);
      const managers = employeePetManage
        .filter((item) => item.petId === pet.petId)
        .map((item) => employeeById.get(item.employeeId)?.employeeName)
        .filter(Boolean)
        .join(' / ');

      return {
        ...pet,
        inventory: stock,
        managers: managers || '待分配',
      };
    });
}

export function getPetInventoryView() {
  return pets.map((pet) => {
    const stock = inventoryByPetId.get(pet.petId);

    return {
      petId: pet.petId,
      petName: pet.petName,
      petSpecies: pet.petSpecies,
      petColor: pet.petColor,
      petPrice: pet.petPrice,
      petStatus: pet.petStatus,
      categoryName: stock?.categoryName ?? '未分类',
      quantity: stock?.quantity ?? 0,
      warehouseLocation: stock?.warehouseLocation ?? '未安排',
      cageCount: stock?.cageCount ?? 0,
      updatedAt: stock?.updatedAt ?? pet.createdAt,
    };
  });
}

export function getSpeciesDistribution() {
  const counters = new Map<string, { species: string; count: number; totalValue: number }>();

  for (const pet of pets) {
    const current = counters.get(pet.petSpecies) ?? {
      species: pet.petSpecies,
      count: 0,
      totalValue: 0,
    };

    current.count += 1;
    current.totalValue += pet.petPrice;
    counters.set(pet.petSpecies, current);
  }

  return [...counters.values()].sort((a, b) => b.count - a.count || b.totalValue - a.totalValue);
}

export function getPetStatusBreakdown() {
  const order: PetStatus[] = ['在售', '已预订', '观察中', '已售出'];
  return order.map((status) => ({
    status,
    count: pets.filter((item) => item.petStatus === status).length,
  }));
}

export function getLowStockAlerts() {
  return inventory
    .filter((item) => item.quantity <= 1 || item.cageCount <= 1)
    .map((item) => {
      const pet = petById.get(item.petId);

      return {
        inventoryId: item.inventoryId,
        petId: item.petId,
        petName: pet?.petName ?? '未知宠物',
        petSpecies: pet?.petSpecies ?? '未知品种',
        quantity: item.quantity,
        cageCount: item.cageCount,
        warehouseLocation: item.warehouseLocation,
        categoryName: item.categoryName,
        updatedAt: item.updatedAt,
      };
    })
    .sort((a, b) => a.quantity - b.quantity || a.cageCount - b.cageCount);
}

export function getInventoryOverview() {
  return {
    totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
    totalCages: inventory.reduce((sum, item) => sum + item.cageCount, 0),
    lowStockCount: getLowStockAlerts().length,
    warehouseCount: new Set(inventory.map((item) => item.warehouseLocation)).size,
  };
}

export function getWarehouseSummary() {
  const summary = new Map<
    string,
    { warehouseLocation: string; petCount: number; quantity: number; cageCount: number; categories: Set<string> }
  >();

  for (const item of inventory) {
    const current = summary.get(item.warehouseLocation) ?? {
      warehouseLocation: item.warehouseLocation,
      petCount: 0,
      quantity: 0,
      cageCount: 0,
      categories: new Set<string>(),
    };

    current.petCount += 1;
    current.quantity += item.quantity;
    current.cageCount += item.cageCount;
    current.categories.add(item.categoryName);

    summary.set(item.warehouseLocation, current);
  }

  return [...summary.values()]
    .map((item) => ({
      warehouseLocation: item.warehouseLocation,
      petCount: item.petCount,
      quantity: item.quantity,
      cageCount: item.cageCount,
      categoryCount: item.categories.size,
    }))
    .sort((a, b) => a.warehouseLocation.localeCompare(b.warehouseLocation, 'zh-CN'));
}

export function getRecentPreorders(limit = 6) {
  return [...preorders]
    .sort((a, b) => Date.parse(b.preorderTime) - Date.parse(a.preorderTime))
    .slice(0, limit)
    .map((item) => {
      const customer = customerById.get(item.customerId);
      const pet = petById.get(item.petId);

      return {
        preorderId: item.preorderId,
        customerName: customer?.customerName ?? '未知顾客',
        petName: pet?.petName ?? '未知宠物',
        petSpecies: pet?.petSpecies ?? '未知品种',
        petPrice: pet?.petPrice ?? 0,
        preorderQty: item.preorderQty,
        preorderTime: item.preorderTime,
        preorderStatus: item.preorderStatus,
        remark: item.remark,
      };
    });
}

export function getReservationBoard() {
  const order: PreorderStatus[] = ['已预约', '待到店', '已完成', '已取消'];
  const rows = getRecentPreorders(preorders.length);

  return order.map((status) => ({
    status,
    items: rows.filter((item) => item.preorderStatus === status),
  }));
}

export function getCustomerReservationRows() {
  return customers
    .map((customer) => {
      const customerPreorders = preorders
        .filter((item) => item.customerId === customer.customerId)
        .sort((a, b) => Date.parse(b.preorderTime) - Date.parse(a.preorderTime));

      const petNames = customerPreorders
        .map((item) => petById.get(item.petId)?.petName ?? '未知宠物')
        .join(' / ');

      const completedValue = customerPreorders
        .filter((item) => item.preorderStatus === '已完成')
        .reduce((sum, item) => sum + (petById.get(item.petId)?.petPrice ?? 0), 0);

      return {
        ...customer,
        reservationCount: customerPreorders.length,
        activeReservationCount: customerPreorders.filter((item) => activePreorderStatuses.has(item.preorderStatus)).length,
        lastReservationTime: customerPreorders[0]?.preorderTime ?? customer.createdAt,
        latestStatus: customerPreorders[0]?.preorderStatus ?? '暂无预约',
        interestedPets: petNames || '暂无记录',
        completedValue,
      };
    })
    .sort((a, b) => Date.parse(b.lastReservationTime) - Date.parse(a.lastReservationTime));
}

export function getEmployeeAssignmentRows() {
  return employees
    .map((employee) => {
      const assignments = employeePetManage
        .filter((item) => item.employeeId === employee.employeeId)
        .sort((a, b) => Date.parse(b.assignedAt) - Date.parse(a.assignedAt));

      const petLabels = assignments
        .map((item) => {
          const pet = petById.get(item.petId);
          return pet ? `${pet.petName}(${pet.petSpecies})` : '未知宠物';
        })
        .join(' / ');

      const latestAssignment = assignments[0]?.assignedAt ?? employee.createdAt;

      return {
        ...employee,
        managedPets: assignments.length,
        managedQty: assignments.reduce((sum, item) => sum + item.manageQty, 0),
        latestAssignment,
        dutySummary: assignments.map((item) => item.dutyNote).join(' / ') || '暂无分工',
        petLabels: petLabels || '暂无负责宠物',
      };
    })
    .sort((a, b) => b.managedQty - a.managedQty || b.salary - a.salary);
}

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
    description: '返回顾客列表及其预约关系，便于未来替换为真实查询。',
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

