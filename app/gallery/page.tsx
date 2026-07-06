import Image from "next/image";
import { getDb } from "@/lib/db";
import PageContainer from "@/components/layout/page-container";
import PhotoDialog from "./photo-dialog";
import { MESSAGES } from "@/lib/message";

export default async function GalleryPage() {
  const photos = await getDb().photo.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageContainer>
      <h1>{MESSAGES.gallery.title}</h1>
      {photos.length === 0 ? (
        <p>{MESSAGES.gallery.empty}</p>
      ) : (
        <ul className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {photos.map((photo) => (
            <li key={photo.id}>
              <PhotoDialog
                src={photo.blobUrl}
                author={photo.guestName || undefined}
                message={photo.message || undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
