import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> },
) {
  const { objectKey } = await params;
  const { createDownloadUrl } = await import("@/server/storage/s3");
  const signedUrl = await createDownloadUrl(objectKey.join("/"));
  redirect(signedUrl);
}
