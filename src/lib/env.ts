import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_BASE_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  STORAGE_PROVIDER: z.enum(["s3", "r2"]).default("r2"),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_PUBLIC_BASE_URL: z.string().optional(),
  DEPLOYER_MOBILE_APK_OBJECT_KEY: z.string().optional(),
  DEPLOYER_MOBILE_VERSION_NAME: z.string().optional(),
  DEPLOYER_MOBILE_VERSION_CODE: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function getServerEnv(): ServerEnv {
  return envSchema.parse(process.env);
}

export function getStorageProviderLabel() {
  return process.env.STORAGE_PROVIDER ?? "r2";
}

export function getDeployerMobileConfig() {
  const objectKey = process.env.DEPLOYER_MOBILE_APK_OBJECT_KEY?.trim();

  return {
    configured: Boolean(objectKey),
    objectKey,
    versionName: process.env.DEPLOYER_MOBILE_VERSION_NAME?.trim() || "Not set",
    versionCode: process.env.DEPLOYER_MOBILE_VERSION_CODE?.trim() || "Not set",
  };
}
