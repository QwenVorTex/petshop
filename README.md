# PetShop OPS

一个参考 `E:\dev\Blog` 前端风格重新搭建的宠物商店系统原型站。

当前状态：

- 前端使用 Astro，整体视觉延续参考站的 neo-brutalist 风格。
- 页面围绕现有 `petshop_schema.sql` 的实体关系搭建。
- 后端接口使用 TypeScript 写在 `src/pages/api/*.ts`。
- 当前不连接数据库，也不创建数据库，所有数据来自 `src/data/mock.ts`。

## 页面

- `/` 仪表盘
- `/pets` 宠物档案
- `/inventory` 库存与仓位
- `/customers` 顾客与预约关系
- `/employees` 员工与负责关系
- `/preorders` 预约看板
- `/insights` 结构与接口说明

## API

- `/api/summary`
- `/api/pets`
- `/api/inventory`
- `/api/customers`
- `/api/employees`
- `/api/preorders`

## 开发

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 后续接数据库建议

1. 保留现有页面结构和字段名不变。
2. 把 `src/data/mock.ts` 拆成 repository 层和真实查询层。
3. 仅替换 `/api/*.ts` 中的数据来源，不直接让页面依赖数据库实现。
