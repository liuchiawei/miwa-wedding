export type UploadMetadata = {
  guestName?: string;
  message?: string;
};

export function parseUploadMetadata(tokenPayload: string | null | undefined): UploadMetadata {
  if (!tokenPayload) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(tokenPayload);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    const record = parsed as Record<string, unknown>;
    return {
      guestName:
        typeof record.guestName === "string" ? record.guestName : undefined,
      message: typeof record.message === "string" ? record.message : undefined,
    };
  } catch {
    return {};
  }
}
