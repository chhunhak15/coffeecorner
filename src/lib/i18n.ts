export type Lang = "en" | "zh" | "vi";

export const translations = {
  en: {
    menuTitle: "Our Drink Menu",
    menuSubtitle: "Cambodian handmade, Cambodian taste, Cambodian Style",
    loading: "Loading menu...",
    noItems: "No drinks in this category yet.",
    adminLogin: "Admin Login",
    signOut: "Sign Out",
    dashboard: "Dashboard",
    categories: {
      all: "All",
      coffee: "Coffee",
      tea: "Tea",
      smoothie: "Smoothies",
      other: "Other",
    },
  },
  zh: {
    menuTitle: "我们的饮品菜单",
    menuSubtitle: "柬埔寨手工制作，柬埔寨味道，柬埔寨风格",
    loading: "正在加载菜单...",
    noItems: "该分类暂无饮品。",
    adminLogin: "管理员登录",
    signOut: "退出登录",
    dashboard: "管理后台",
    categories: {
      all: "全部",
      coffee: "咖啡",
      tea: "茶饮",
      smoothie: "奶昔",
      other: "其他",
    },
  },
  vi: {
    menuTitle: "Thực Đơn Đồ Uống",
    menuSubtitle: "Thủ công Campuchia, hương vị Campuchia, phong cách Campuchia",
    loading: "Đang tải thực đơn...",
    noItems: "Chưa có đồ uống trong danh mục này.",
    adminLogin: "Đăng Nhập Admin",
    signOut: "Đăng Xuất",
    dashboard: "Bảng Điều Khiển",
    categories: {
      all: "Tất Cả",
      coffee: "Cà Phê",
      tea: "Trà",
      smoothie: "Sinh Tố",
      other: "Khác",
    },
  },
} satisfies Record<Lang, typeof translations["en"]>;
