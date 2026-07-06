import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { getAutoApproveUploads } from "@/lib/site-settings";

function isValidBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pending = searchParams.get("pending") === "true";

  if (pending && !(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const photos = await getDb().photo.findMany({
      where: { approved: pending ? false : true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch photos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: {
    blobUrl?: unknown;
    pathname?: unknown;
    contentType?: unknown;
    guestName?: unknown;
    message?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { blobUrl, pathname, contentType, guestName, message } = body;

  if (typeof blobUrl !== "string" || !isValidBlobUrl(blobUrl)) {
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
  }

  if (typeof pathname !== "string" || pathname.length === 0) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
  }

  try {
    const existing = await getDb().photo.findFirst({
      where: { pathname },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const autoApprove = await getAutoApproveUploads();

    const photo = await getDb().photo.create({
      data: {
        blobUrl,
        pathname,
        contentType: typeof contentType === "string" ? contentType : null,
        guestName: typeof guestName === "string" ? guestName : null,
        message: typeof message === "string" ? message : null,
        approved: autoApprove,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to register photo",
      },
      { status: 500 },
    );
  }
}
