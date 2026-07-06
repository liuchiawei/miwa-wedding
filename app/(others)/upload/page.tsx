import { PhotoUploader } from "@/components/section/photo-uploader";
import { MESSAGES } from "@/lib/message";

export default function UploadPage() {
  return (
    <>
      <h1>{MESSAGES.upload.title}</h1>
      <PhotoUploader />
    </>
  );
}
