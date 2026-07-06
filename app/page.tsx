import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Miwa Wedding</h1>
      <p>日時: 2026年（未定）</p>
      <p>場所: 日本（未定）</p>
      <nav>
        <ul>
          <li>
            <Link href="/upload">写真をアップロード</Link>
          </li>
          <li>
            <Link href="/gallery">フォトギャラリー</Link>
          </li>
          <li>
            <Link href="/admin">管理画面</Link>
          </li>
          <li>
            <Link href="/qr">QRコード</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
