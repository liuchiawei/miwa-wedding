import Image from "next/image";
import { getDb } from "@/lib/db";

export default async function GalleryPage() {
  const photos = await getDb().photo.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>フォトギャラリー</h1>
      {photos.length === 0 ? (
        <p>まだ写真がありません。</p>
      ) : (
        <ul>
          {photos.map((photo) => (
            <li key={photo.id}>
              <Image
                src={photo.blobUrl}
                alt={photo.guestName ?? "Wedding photo"}
                width={400}
                height={400}
                style={{ width: "auto", height: "auto", maxWidth: 400 }}
              />
              {photo.guestName && <p>{photo.guestName}</p>}
              {photo.message && <p>{photo.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
