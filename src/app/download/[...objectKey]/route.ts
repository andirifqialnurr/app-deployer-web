import { redirect } from "next/navigation";
import { createDownloadUrl } from "@/server/storage/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> },
) {
  const { objectKey } = await params;
  const signedUrl = await createDownloadUrl(objectKey.join("/"));
  redirect(signedUrl);
}
