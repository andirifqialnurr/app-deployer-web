import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export const storageClient = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export function buildApkObjectKey(input: {
  packageName: string;
  versionCode: number;
  fileName?: string;
}) {
  const safeFileName = input.fileName ?? `${input.versionCode}.apk`;
  return `apks/${input.packageName}/${input.versionCode}/${safeFileName}`;
}

export async function createUploadUrl(input: {
  objectKey: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: input.objectKey,
    ContentType: input.contentType,
  });

  return getSignedUrl(storageClient, command, { expiresIn: 900 });
}

export async function createDownloadUrl(objectKey: string) {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: objectKey,
  });

  return getSignedUrl(storageClient, command, { expiresIn: 900 });
}
