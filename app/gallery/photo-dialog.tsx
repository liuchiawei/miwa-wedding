import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function PhotoDialog({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="w-full h-full object-cover">
        <Image
          src={src}
          alt={alt ?? "Wedding Photo"}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </DialogTrigger>
      <DialogContent className="p-0">
        <Image
          src={src}
          alt={alt ?? "Wedding Photo"}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}
