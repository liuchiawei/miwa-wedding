import { getDb } from "@/lib/db";

const DEFAULT_SETTING_ID = "default";

export async function getAutoApproveUploads(): Promise<boolean> {
  try {
    const setting = await getDb().siteSetting.findUnique({
      where: { id: DEFAULT_SETTING_ID },
    });

    return setting?.autoApproveUploads ?? true;
  } catch {
    return true;
  }
}

export async function setAutoApproveUploads(
  value: boolean,
): Promise<{ autoApproveUploads: boolean }> {
  const setting = await getDb().siteSetting.upsert({
    where: { id: DEFAULT_SETTING_ID },
    create: { id: DEFAULT_SETTING_ID, autoApproveUploads: value },
    update: { autoApproveUploads: value },
  });

  return { autoApproveUploads: setting.autoApproveUploads };
}
