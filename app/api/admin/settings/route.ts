import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import {
  getAutoApproveUploads,
  setAutoApproveUploads,
} from "@/lib/site-settings";

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const autoApproveUploads = await getAutoApproveUploads();
    return NextResponse.json({ autoApproveUploads });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch settings",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let autoApproveUploads: unknown;
  try {
    const body = (await request.json()) as { autoApproveUploads?: unknown };
    autoApproveUploads = body.autoApproveUploads;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof autoApproveUploads !== "boolean") {
    return NextResponse.json(
      { error: "autoApproveUploads must be a boolean" },
      { status: 400 },
    );
  }

  try {
    const settings = await setAutoApproveUploads(autoApproveUploads);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update settings",
      },
      { status: 500 },
    );
  }
}
