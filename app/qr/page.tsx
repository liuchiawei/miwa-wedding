import QRCode from "qrcode";
import { headers } from "next/headers";

function getUploadUrl(origin: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? origin;
  return `${base.replace(/\/$/, "")}/upload`;
}

export default async function QrPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;
  const uploadUrl = getUploadUrl(origin);

  const dataUrl = await QRCode.toDataURL(uploadUrl, {
    width: 300,
    margin: 2,
  });

  return (
    <main>
      <h1>アップロード用 QR コード</h1>
      <p>この QR コードをスキャンすると写真アップロードページに移動します。</p>
      <p>
        URL: <code>{uploadUrl}</code>
      </p>
      <img src={dataUrl} alt={`QR code for ${uploadUrl}`} width={300} height={300} />
      <p>
        <a href={dataUrl} download="miwa-wedding-upload-qr.png">
          PNG をダウンロード
        </a>
      </p>
    </main>
  );
}
