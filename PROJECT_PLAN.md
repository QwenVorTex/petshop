# 宠物商店管理系统 — 项目分工与实现方案

> 课程：数据库原理  
> 项目名称：宠物商店管理系统（PetShop Management System）  
> 技术栈：Astro + TypeScript（前端）、MySQL 8.x（数据库）、Node.js mysql2（后端连接）  

---

## 一、项目简介

本系统是一个面向小型宠物商店的信息管理系统，用于管理宠物商品、库存、客户、员工和预约等核心业务。系统提供直观的 Web 界面，支持对各业务实体的增删改查（CRUD）操作，底层通过 MySQL 数据库存储和管理数据。

---

## 二、小组成员与分工

### 成员 A — 赵启文（前端主力）

**职责：** 完善前端页面的 UI/交互，实现用户操作界面

**具体任务：**

- 完善现有 7 个页面（首页仪表盘、宠物目录、库存管理、客户管理、员工管理、预约看板、系统洞察）的界面展示效果
- 为每个实体（宠物、客户、员工、库存、预约）添加「新增」「编辑」「删除」操作表单和交互按钮
- 添加搜索框、筛选条件、分页功能，提升数据浏览体验
- 与徐哲岩对接 API 接口，将前端表单提交和数据展示连接到后端 API
- 处理前端的加载状态、错误提示、操作成功反馈等用户体验细节

**主要涉及文件：**

- `src/pages/*.astro` — 各页面
- `src/components/*.astro` — 可复用组件
- `src/styles/*.css` — 样式文件

---

### 成员 B — 徐哲岩（后端 + 数据库）

**职责：** 搭建数据库、实现后端 API、完成前后端数据连接

**具体任务：**

- 在本地安装 MySQL 8.x，执行 `petshop_schema.sql` 创建数据库和表，填充初始测试数据
- 安装 `mysql2` 驱动，编写数据库连接模块（连接池配置、环境变量管理）
- 将 Astro 配置从静态模式切换为 `output: 'server'` 模式，安装 `@astrojs/node` 适配器
- 用真实 SQL 查询替换 `src/data/mock.ts` 中的模拟数据函数
- 为现有 6 个 GET 接口补充真实数据库查询逻辑
- 新增 POST / PUT / DELETE 接口，实现完整的 CRUD 功能
- 做好 SQL 注入防护（使用参数化查询）和数据库错误处理

**主要涉及文件：**

- `petshop_schema.sql` — 数据库建表脚本
- `src/data/mock.ts` → 改造为 `src/data/db.ts`（数据库连接与查询）
- `src/pages/api/*.ts` — API 路由
- `astro.config.mjs` — 框架配置
- `.env` — 数据库连接信息（新建）

---

### 成员 C — 连雨晨（后端辅助 + 测试）

**职责：** 协助后端开发，负责系统测试与质量保障

**具体任务：**

前期（协助后端）：
- 协助徐哲岩编写部分 SQL 查询语句和 API 接口
- 负责准备和维护测试用数据（INSERT 语句），确保各种业务场景都有对应数据
- 协助调试数据库连接问题和 SQL 语句错误

中期（测试）：
- 对每个 API 接口进行功能测试（使用 Postman 或浏览器），验证返回数据正确性
- 对每个页面的 CRUD 操作进行端到端测试，记录测试用例和结果
- 测试边界情况：空数据、重复数据、非法输入、并发操作等

后期（改良）：
- 整理测试中发现的 Bug，与相应成员协作修复
- 进行最终的集成测试，确保所有功能协同工作
- 对系统做性能和体验上的优化建议

**主要产出：**

- 测试数据 SQL 脚本
- 测试用例文档（记录操作步骤、预期结果、实际结果）
- Bug 记录与修复跟踪

---

### 成员 D — 王涵（文档 + PPT + 辅助）

**职责：** 项目文档编写、答辩 PPT 制作、协助其他成员

**具体任务：**

前期：
- 撰写数据库设计说明文档（ER 图、表结构说明、关系说明、设计理由）
- 整理项目需求文档，明确系统功能清单

中期：
- 协助徐哲岩填充和校验测试数据
- 记录项目开发过程中的关键决策和遇到的问题

后期：
- 制作答辩 PPT，内容涵盖：项目背景、系统架构、数据库设计、功能演示、分工说明、总结与展望
- 准备系统演示流程，确保答辩时操作流畅
- 整理项目最终文档

**主要产出：**

- 数据库设计文档
- 答辩 PPT
- 项目总结报告

---

## 三、系统功能清单

### 3.1 核心功能（CRUD）

| 模块 | 查询 | 新增 | 编辑 | 删除 | 说明 |
|------|:----:|:----:|:----:|:----:|------|
| 宠物管理 | ✅ | ✅ | ✅ | ✅ | 管理在售宠物信息，包括名称、品种、颜色、年龄、价格、状态 |
| 库存管理 | ✅ | ✅ | ✅ | ✅ | 跟踪每种宠物的库存数量、笼位数、仓库位置 |
| 客户管理 | ✅ | ✅ | ✅ | ✅ | 记录客户姓名、电话、身份证号 |
| 员工管理 | ✅ | ✅ | ✅ | ✅ | 管理员工信息、薪资、负责的宠物分配 |
| 预约管理 | ✅ | ✅ | ✅ | ✅ | 客户预约宠物，支持状态流转（已预约→待到店→已完成/已取消） |
| 员工-宠物分配 | ✅ | ✅ | ✅ | ✅ | 分配员工负责照顾特定宠物 |

### 3.2 数据展示功能

| 功能 | 说明 |
|------|------|
| 首页仪表盘 | 展示关键指标：在售宠物数、待处理预约数、低库存预警、月薪资支出 |
| 宠物库存视图 | 对应 SQL 视图 `v_pet_inventory`，联合展示宠物信息和库存情况 |
| 预约看板 | 按状态分列展示预约单（已预约 / 待到店 / 已完成 / 已取消） |
| 低库存预警 | 自动标记库存 ≤ 1 或笼位 ≤ 1 的记录 |
| 员工工作量 | 显示每位员工负责的宠物数量和职责说明 |

### 3.3 辅助功能

| 功能 | 说明 |
|------|------|
| 搜索 | 支持按关键字搜索宠物、客户、员工 |
| 筛选 | 按状态、品种等条件筛选数据 |
| 分页 | 数据量大时分页显示 |

---

## 四、数据库设计概要

### 4.1 数据库表结构

```
petshop_db
├── customer        — 客户表（customer_id, customer_name, phone, id_card, created_at）
├── employee        — 员工表（employee_id, employee_name, gender, phone, salary, age, created_at）
├── pet             — 宠物表（pet_id, pet_name, pet_species, pet_color, pet_age, pet_price, pet_status, created_at）
├── inventory       — 库存表（inventory_id, pet_id, category_name, quantity, warehouse_location, cage_count, updated_at）
├── preorder        — 预约表（preorder_id, customer_id, pet_id, preorder_qty, preorder_time, preorder_status, remark）
└── employee_pet_manage — 员工-宠物分配表（employee_id, pet_id, manage_qty, duty_note, assigned_at）
```

### 4.2 表间关系

```
customer ──1:N──→ preorder ←─N:1── pet
                                    ↑
employee ──M:N──→ employee_pet_manage ──→ pet
                                    ↓
                              inventory (1:1)
```

- `inventory.pet_id` → `pet.pet_id`（一对一，每种宠物一条库存记录）
- `preorder.customer_id` → `customer.customer_id`（一个客户可有多条预约）
- `preorder.pet_id` → `pet.pet_id`（一种宠物可被多次预约）
- `employee_pet_manage` 是员工和宠物的多对多关联表

### 4.3 视图

- `v_pet_inventory`：LEFT JOIN `pet` 和 `inventory`，统一展示宠物详情与库存信息

### 4.4 索引

- `idx_pet_species` — 按宠物品种查询加速
- `idx_inventory_category` — 按库存类别查询加速
- `idx_preorder_time` — 按预约时间排序加速
- `idx_preorder_status` — 按预约状态筛选加速

---

## 五、技术实现方案

### 5.1 整体架构

```
浏览器（用户）
    ↓ HTTP 请求
Astro 页面（SSR 服务端渲染）
    ↓ 调用
API 路由（src/pages/api/*.ts）
    ↓ SQL 查询
mysql2 连接池
    ↓
MySQL 8.x 数据库（petshop_db）
```

### 5.2 关键技术点

| 技术点 | 实现方式 |
|--------|----------|
| 前端框架 | Astro 5.x + TypeScript，SSR 模式 |
| 页面渲染 | Astro 组件（.astro 文件），服务端渲染 HTML |
| API 接口 | Astro API Routes，RESTful 风格 |
| 数据库连接 | mysql2/promise 连接池 |
| 数据库 | MySQL 8.x |
| SQL 安全 | 参数化查询（Prepared Statements），防止 SQL 注入 |
| 环境变量 | .env 文件存储数据库连接信息，不提交到版本控制 |

### 5.3 API 接口设计

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/pets` | 查询宠物列表 |
| POST | `/api/pets` | 新增宠物 |
| PUT | `/api/pets` | 更新宠物信息 |
| DELETE | `/api/pets` | 删除宠物 |
| GET | `/api/inventory` | 查询库存 |
| POST | `/api/inventory` | 新增/更新库存 |
| GET | `/api/customers` | 查询客户列表 |
| POST | `/api/customers` | 新增客户 |
| PUT | `/api/customers` | 更新客户信息 |
| DELETE | `/api/customers` | 删除客户 |
| GET | `/api/employees` | 查询员工列表 |
| POST | `/api/employees` | 新增员工 |
| PUT | `/api/employees` | 更新员工信息 |
| DELETE | `/api/employees` | 删除员工 |
| GET | `/api/preorders` | 查询预约列表 |
| POST | `/api/preorders` | 新增预约 |
| PUT | `/api/preorders` | 更新预约状态 |
| DELETE | `/api/preorders` | 取消预约 |
| GET | `/api/summary` | 首页仪表盘数据 |

### 5.4 数据库连接示例

```typescript
// src/data/db.ts
import mysql from 'mysql2/promise';

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
```

---

## 六、开发阶段与时间安排

### 第一阶段：基础搭建（第 1 周）

| 成员 | 任务 |
|------|------|
| 赵启文 | 梳理现有页面，规划需要新增的表单和交互组件 |
| 徐哲岩 | 安装 MySQL，建库建表，填充初始数据，搭建数据库连接模块 |
| 连雨晨 | 协助徐哲岩准备测试数据（编写 INSERT 语句），学习 mysql2 用法 |
| 王涵 | 撰写数据库设计文档（ER 图、表结构说明） |

### 第二阶段：核心开发（第 2-3 周）

| 成员 | 任务 |
|------|------|
| 赵启文 | 开发各实体的新增/编辑/删除表单，添加搜索和筛选功能 |
| 徐哲岩 | 实现 GET 接口的真实查询，开发 POST/PUT/DELETE 接口 |
| 连雨晨 | 协助徐哲岩开发部分 API 接口，同步开始编写测试用例 |
| 王涵 | 记录开发过程，协助数据校验，开始准备 PPT 框架 |

### 第三阶段：集成与测试（第 4 周）

| 成员 | 任务 |
|------|------|
| 赵启文 | 前后端联调，修复 UI Bug |
| 徐哲岩 | 修复后端 Bug，优化 SQL 查询性能 |
| 连雨晨 | 执行完整功能测试和集成测试，整理 Bug 列表 |
| 王涵 | 完成答辩 PPT，准备演示流程 |

### 第四阶段：收尾与答辩（第 5 周）

| 成员 | 任务 |
|------|------|
| 全体 | 修复剩余 Bug，完善细节 |
| 全体 | 答辩彩排，确认演示流程 |
| 王涵 | 主导答辩 PPT 定稿和演示准备 |

---

## 七、文件结构

```
petshop/
├── .env                        # 数据库连接配置（不提交 git）
├── astro.config.mjs            # Astro 框架配置
├── package.json                # 项目依赖
├── petshop_schema.sql          # 数据库建表脚本
├── PROJECT_PLAN.md             # 本文档
├── tsconfig.json               # TypeScript 配置
├── public/                     # 静态资源
├── src/
│   ├── components/             # 可复用 UI 组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PageHero.astro
│   │   ├── Button.astro
│   │   ├── MetricCard.astro
│   │   ├── SectionIntro.astro
│   │   ├── StatusPill.astro
│   │   ├── ScrollReveal.astro
│   │   └── BrutalistCursor.astro
│   ├── config/
│   │   └── site.ts             # 站点配置
│   ├── data/
│   │   ├── mock.ts             # 模拟数据（将被替换）
│   │   └── db.ts               # 数据库连接与查询（待新建）
│   ├── layouts/
│   │   └── BaseLayout.astro    # 页面布局
│   ├── lib/
│   │   ├── format.ts           # 日期/货币格式化
│   │   └── http.ts             # HTTP 响应工具
│   ├── pages/
│   │   ├── index.astro         # 首页仪表盘
│   │   ├── pets.astro          # 宠物管理
│   │   ├── inventory.astro     # 库存管理
│   │   ├── customers.astro     # 客户管理
│   │   ├── employees.astro     # 员工管理
│   │   ├── preorders.astro     # 预约管理
│   │   ├── insights.astro      # 系统洞察
│   │   └── api/                # API 路由
│   │       ├── summary.ts
│   │       ├── pets.ts
│   │       ├── inventory.ts
│   │       ├── customers.ts
│   │       ├── employees.ts
│   │       └── preorders.ts
│   └── styles/                 # 全局样式
│       ├── variables.css
│       ├── typography.css
│       ├── animations.css
│       ├── brutalist.css
│       └── global.css
└── dist/                       # 构建产物
```
