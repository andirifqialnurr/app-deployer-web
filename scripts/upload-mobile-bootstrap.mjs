import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const apkPath = process.argv[2];

if (!apkPath) {
  console.error("Usage: bun scripts/upload-mobile-bootstrap.mjs <path-to-apk>");
  process.exit(1);
}

const required = [
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_BUCKET",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`${key} is missing`);
    process.exit(1);
  }
}

const objectKey =
  process.env.DEPLOYER_MOBILE_APK_OBJECT_KEY || "bootstrap/app-deployer-mobile.apk";
const body = await readFile(apkPath);
const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: objectKey,
    Body: body,
    ContentType: "application/vnd.android.package-archive",
    Metadata: {
      filename: basename(apkPath),
    },
  }),
);

console.log(`Replaced bootstrap object with ${apkPath}`);
console.log(`Bucket: ${process.env.S3_BUCKET}`);
console.log(`Object: ${objectKey}`);
