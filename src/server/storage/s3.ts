import { Readable } from "node:stream";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  type GetObjectCommandOutput,
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

function toWebStream(body: GetObjectCommandOutput["Body"]) {
  if (!body) {
    throw new Error("Storage object has no readable body.");
  }

  if (body instanceof ReadableStream) {
    return body;
  }

  if ("transformToWebStream" in body && typeof body.transformToWebStream === "function") {
    return body.transformToWebStream();
  }

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  throw new Error("Storage object body is not streamable.");
}

function safeAttachmentFileName(fileName: string) {
  return fileName.replace(/[\\/\r\n"]/g, "_");
}

export async function createDownloadResponse(input: {
  objectKey: string;
  fileName: string;
}) {
  const env = getServerEnv();
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: input.objectKey,
  });
  const object = await createStorageClient().send(command);
  const fileName = safeAttachmentFileName(input.fileName);
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    "Content-Type": object.ContentType ?? "application/vnd.android.package-archive",
  });

  if (object.ContentLength !== undefined) {
    headers.set("Content-Length", object.ContentLength.toString());
  }

  return new Response(toWebStream(object.Body), { headers });
}

export async function deleteObject(objectKey: string) {
  const env = getServerEnv();
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: objectKey,
  });

  await createStorageClient().send(command);
}
