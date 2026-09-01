import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerEnv } from "@/lib/env";

function createStorageClient() {
  const env = getServerEnv();

  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });
}

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
  const env = getServerEnv();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: input.objectKey,
    ContentType: input.contentType,
  });

  return getSignedUrl(createStorageClient(), command, { expiresIn: 900 });
}

export async function createDownloadUrl(objectKey: string, fileName?: string) {
  const env = getServerEnv();
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: objectKey,
    ResponseContentDisposition: fileName
      ? `attachment; filename="${fileName.replaceAll('"', "")}"`
      : undefined,
  });

  return getSignedUrl(createStorageClient(), command, { expiresIn: 900 });
}

export async function deleteObject(objectKey: string) {
  const env = getServerEnv();
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: objectKey,
  });

  await createStorageClient().send(command);
}
