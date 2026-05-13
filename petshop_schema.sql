-- 宠物商店系统数据库建表脚本
-- 适用数据库：MySQL 8.x
-- 说明：
-- 1. 根据功能结构图和 ER 图整理。
-- 2. 图中部分属性不够清晰，以下字段做了合理补全，保证可直接执行。

DROP DATABASE IF EXISTS petshop_db;
CREATE DATABASE petshop_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE petshop_db;

-- 顾客表
CREATE TABLE customer (
  customer_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '顾客编号',
  customer_name VARCHAR(50) NOT NULL COMMENT '姓名',
  phone VARCHAR(20) NOT NULL UNIQUE COMMENT '电话',
  id_card VARCHAR(18) NOT NULL UNIQUE COMMENT '身份证号',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='顾客信息表';

-- 员工表
CREATE TABLE employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '员工编号',
  employee_name VARCHAR(50) NOT NULL COMMENT '员工姓名',
  gender VARCHAR(10) NOT NULL COMMENT '员工性别',
  phone VARCHAR(20) UNIQUE COMMENT '员工电话',
  salary DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '员工工资',
  age INT COMMENT '员工年龄',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  CONSTRAINT chk_employee_gender CHECK (gender IN ('男', '女'))
) COMMENT='员工信息表';

-- 宠物表
CREATE TABLE pet (
  pet_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物编号',
  pet_name VARCHAR(50) NOT NULL COMMENT '宠物名称',
  pet_species VARCHAR(50) NOT NULL COMMENT '宠物品种',
  pet_color VARCHAR(30) COMMENT '宠物毛色',
  pet_age INT COMMENT '宠物年龄(月)',
  pet_price DECIMAL(10,2) NOT NULL COMMENT '宠物价格',
  pet_status VARCHAR(20) NOT NULL DEFAULT '在售' COMMENT '宠物状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='宠物信息表';

-- 库存表
CREATE TABLE inventory (
  inventory_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '库存编号',
  pet_id INT NOT NULL COMMENT '宠物编号',
  category_name VARCHAR(50) NOT NULL COMMENT '类别名称',
  quantity INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  warehouse_location VARCHAR(100) COMMENT '库存位置',
  cage_count INT NOT NULL DEFAULT 0 COMMENT '宠物笼数量',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  CONSTRAINT fk_inventory_pet
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0),
  CONSTRAINT chk_inventory_cage_count CHECK (cage_count >= 0)
) COMMENT='库存信息表';

-- 预购/预约表
CREATE TABLE preorder (
  preorder_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '预购编号',
  customer_id INT NOT NULL COMMENT '顾客编号',
  pet_id INT NOT NULL COMMENT '宠物编号',
  preorder_qty INT NOT NULL DEFAULT 1 COMMENT '预购数量',
  preorder_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预购时间',
  preorder_status VARCHAR(20) NOT NULL DEFAULT '已预约' COMMENT '预购状态',
  remark VARCHAR(200) COMMENT '备注',
  CONSTRAINT fk_preorder_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_preorder_pet
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_preorder_qty CHECK (preorder_qty > 0)
) COMMENT='顾客预购表';

-- 员工管理宠物关系表
CREATE TABLE employee_pet_manage (
  employee_id INT NOT NULL COMMENT '员工编号',
  pet_id INT NOT NULL COMMENT '宠物编号',
  manage_qty INT NOT NULL DEFAULT 1 COMMENT '负责数量',
  duty_note VARCHAR(200) COMMENT '管理说明',
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
  PRIMARY KEY (employee_id, pet_id),
  CONSTRAINT fk_manage_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_manage_pet
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT chk_manage_qty CHECK (manage_qty > 0)
) COMMENT='员工与宠物管理关系表';

-- 常用索引
CREATE INDEX idx_pet_species ON pet(pet_species);
CREATE INDEX idx_inventory_category ON inventory(category_name);
CREATE INDEX idx_preorder_time ON preorder(preorder_time);
CREATE INDEX idx_preorder_status ON preorder(preorder_status);

-- 可选初始化视图：方便做“查询”类功能
CREATE VIEW v_pet_inventory AS
SELECT
  p.pet_id,
  p.pet_name,
  p.pet_species,
  p.pet_color,
  p.pet_price,
  i.inventory_id,
  i.category_name,
  i.quantity,
  i.warehouse_location
FROM pet AS p
LEFT JOIN inventory AS i ON p.pet_id = i.pet_id;
