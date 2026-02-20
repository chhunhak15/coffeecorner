export type Lang = "en" | "zh" | "vi";

export const translations = {
  en: {
    menuTitle: "Our Drink Menu",
    menuSubtitle: "Handcrafted beverages made with love and the finest ingredients.",
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
    menuSubtitle: "用爱和最优质的食材精心制作的饮品。",
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
    menuSubtitle: "Đồ uống thủ công được làm bằng tình yêu và nguyên liệu tươi ngon nhất.",
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
