export const siteConfig = {
  title: 'PetShop OPS',
  name: 'PetShop Operations',
  shortName: 'PSHOP',
  description: '宠物商店运营管理平台。',
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
    eyebrow: 'Pet Shop System',
    title: '宠物商店管理系统',
    subtitle:
      '围绕宠物、库存、顾客、员工和预约五大模块构建的运营管理平台。',
    primaryCta: { label: '查看宠物档案', href: '/pets' },
    secondaryCta: { label: '查看接口设计', href: '/insights' },
  },
} as const;

