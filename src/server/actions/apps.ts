"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/server/db";

const createAppSchema = z.object({
  name: z.string().trim().min(2).max(80),
  packageName: z.string().trim().min(3).max(160),
  description: z.string().trim().max(240).optional(),
});

export async function createAppAction(formData: FormData) {
  const input = createAppSchema.parse({
    name: formData.get("name"),
    packageName: formData.get("packageName"),
    description: formData.get("description") || undefined,
  });

  await db.mobileApp.create({ data: input });
  revalidatePath("/apps");
  revalidatePath("/dashboard");
  redirect("/apps");
}
