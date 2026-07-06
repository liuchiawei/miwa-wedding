import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function PhotoDialog({
  src,
  alt,
  author,
  message,
}: {
  src: string;
  alt?: string;
  author?: string;
  message?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="size-full aspect-square">
        <Image
          src={src}
          alt={alt ?? "Wedding Photo"}
          width={400}
          height={400}
          className="size-full object-cover"
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
        <div aria-label="Photo Details" className="absolute bottom-0 left-0 p-4 *:text-white *:text-shadow-md">
          {author && <h1 className="text-2xl font-bold">{author}</h1>}
          {message && <p className="text-lg">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
