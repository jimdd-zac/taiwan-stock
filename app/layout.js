export const metadata = {
  title: "台灣股市基本面雷達",
  description: "EPS獲利篩選 · 個股深度查詢 · AI智能分析",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
