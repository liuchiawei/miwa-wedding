"use client";

import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type UploadStatus = "pending" | "uploading" | "done" | "error";

type FileItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number;
  error?: string;
};

async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: 1920,
    maxSizeMB: 1,
    useWebWorker: true,
  });
}

export function PhotoUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const allDone =
    items.length > 0 && items.every((item) => item.status === "done");

  const hasPendingItems = items.some((item) => item.status === "pending");

  useEffect(() => {
    return () => {
      for (const item of items) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, [items]);

  useEffect(() => {
    if (allDone) {
      router.push("/gallery");
    }
  }, [allDone, router]);

  const updateItem = useCallback((id: string, patch: Partial<FileItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const uploadFile = useCallback(
    async (item: FileItem) => {
      updateItem(item.id, { status: "uploading", progress: 0, error: undefined });

      try {
        const compressed = await compressImage(item.file);
        const clientPayload = JSON.stringify({
          guestName: guestName.trim() || undefined,
          message: message.trim() || undefined,
        });

        const blob = await upload(item.file.name, compressed, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload,
          onUploadProgress: ({ percentage }) => {
            updateItem(item.id, { progress: Math.round(percentage) });
          },
        });

        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blobUrl: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType,
            guestName: guestName.trim() || undefined,
            message: message.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? "Failed to register photo");
        }

        updateItem(item.id, { status: "done", progress: 100 });
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
    [guestName, message, updateItem],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const newItems: FileItem[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
      progress: 0,
    }));

    setItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const handleUpload = async () => {
    const pendingItems = items.filter((item) => item.status === "pending");
    if (pendingItems.length === 0) {
      return;
    }

    setIsUploading(true);
    await Promise.allSettled(pendingItems.map((item) => uploadFile(item)));
    setIsUploading(false);
  };

  const retryUpload = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) {
      return;
    }
    setIsUploading(true);
    await uploadFile(item);
    setIsUploading(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          お名前（任意）
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            disabled={isUploading}
            className="border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          メッセージ（任意）
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isUploading}
            rows={3}
            className="border border-border bg-background px-3 py-2"
          />
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileChange}
        disabled={isUploading}
        className="sr-only"
      />

      <Button
        type="button"
        size="lg"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        写真を選ぶ
      </Button>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="aspect-square w-full object-cover"
              />
              <span className="truncate text-xs">{item.file.name}</span>
              {item.status === "pending" && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">待機中</span>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-destructive"
                    >
                      削除
                    </button>
                  )}
                </div>
              )}
              {item.status === "uploading" && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs">アップロード中 {item.progress}%</span>
                  <progress value={item.progress} max={100} className="w-full" />
                </div>
              )}
              {item.status === "done" && (
                <span className="text-xs text-primary">完了</span>
              )}
              {item.status === "error" && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-destructive">
                    失敗: {item.error}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => retryUpload(item.id)}
                    disabled={isUploading}
                  >
                    再試行
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasPendingItems && (
        <Button
          type="button"
          size="lg"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? "アップロード中..." : "アップロード"}
        </Button>
      )}

    </div>
  );
}
