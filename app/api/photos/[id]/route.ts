import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let approved: unknown;
  try {
    const body = (await request.json()) as { approved?: unknown };
    approved = body.approved;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof approved !== "boolean") {
    return NextResponse.json(
      { error: "approved must be a boolean" },
      { status: 400 },
    );
  }

  try {
    const photo = await getDb().photo.update({
      where: { id },
      data: { approved },
    });
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const photo = await getDb().photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await del(photo.pathname);
    await getDb().photo.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete photo",
      },
      { status: 500 },
    );
  }
}
