import { z } from "zod";

export const androidPackageNameSchema = z
  .string()
  .trim()
  .min(3)
  .max(160)
  .regex(
    /^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$/,
    "Use a valid Android applicationId, for example com.example.myapp.",
  );
