const site = {
  title: "Miwa Wedding",
  description: "Miwa Wedding",
  date: "日時",
  location: "場所",
};

const wedding = {
  date: "2026年（未定）",
  time: "10:00",
  location: "日本（未定）",
};

const navigation = {
  upload: {
    text: "アップロード",
    href: "/upload",
  },
  gallery: {
    text: "ギャラリー",
    href: "/gallery",
  },
  admin: {
    text: "管理画面",
    href: "/admin",
  },
  qr: {
    text: "QRコード",
    href: "/qr",
  },
};

const footer = {
  copyright: "© 2026 Miwa Wedding",
};

const contact = {
  email: "info@miwa-wedding.com",
  phone: "+81 90 1234 5678",
  address: "東京都千代田区永田町1-7-1",
};

const gallery = {
  title: "フォトギャラリー",
  empty: "まだ写真がありません。",
};

const upload = {
  title: "写真をアップロード",
  success: "写真をアップロードしました。",
  error: "写真をアップロードできませんでした。",
  pending: "アップロード中...",
  upload: "アップロード",
  retry: "再試行",
  name: "名前",
  message: "メッセージ",
};

export const MESSAGES = {
  site,
  wedding,
  contact,
  navigation,
  footer,
  gallery,
  upload,
} as const;
