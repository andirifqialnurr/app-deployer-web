export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> },
) {
  const { objectKey } = await params;
  const key = objectKey.join("/");
  const { createDownloadResponse } = await import("@/server/storage/s3");

  return createDownloadResponse({
    objectKey: key,
    fileName: objectKey.at(-1) ?? "download.apk",
  });
}
