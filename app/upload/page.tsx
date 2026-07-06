import { PhotoUploader } from "@/components/section/photo-uploader";
import PageContainer from "@/components/layout/page-container";
import { MESSAGES } from "@/lib/message";

export default function UploadPage() {
  return (
    <PageContainer>
      <h1>{MESSAGES.upload.title}</h1>
      <PhotoUploader />
    </PageContainer>
  );
}
