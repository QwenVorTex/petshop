export const siteConfig = {
  title: 'PetShop OPS',
  name: 'PetShop Operations Prototype',
  shortName: 'PSHOP',
  description:
    '一个使用 Astro + TypeScript + mock data 搭建的宠物商店系统原型站，当前不连接数据库，优先验证信息结构、页面流程和接口形态。',
  locale: 'zh-CN',
  url: 'http://localhost:4321',
  navigation: {
    primary: [
      { label: '仪表盘', href: '/' },
      { label: '宠物', href: '/pets' },
      { label: '库存', href: '/inventory' },
      { label: '顾客', href: '/customers' },
      { label: '员工', href: '/employees' },
    ],
    secondary: [
      { label: '预约', href: '/preorders' },
      { label: '洞察', href: '/insights' },
    ],
  },
  dashboard: {
    eyebrow: 'Pet Shop System Prototype',
    title: '宠物商店系统，先把界面和流程跑起来',
    subtitle:
      '页面结构和 TypeScript 接口已经围绕现有 SQL schema 建好，当前全部数据来自 mock layer，后续可以直接替换为真实数据库查询。',
    primaryCta: { label: '查看宠物档案', href: '/pets' },
    secondaryCta: { label: '查看接口设计', href: '/insights' },
  },
} as const;

