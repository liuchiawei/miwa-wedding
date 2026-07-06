import { PhotoUploader } from "@/components/upload/photo-uploader";
import { MESSAGES } from "@/lib/message";

export default function UploadPage() {
  return (
    <main>
      <h1>{MESSAGES.upload.title}</h1>
      <PhotoUploader />
    </main>
  );
}
