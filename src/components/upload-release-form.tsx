"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type AppOption = {
  id: string;
  name: string;
  packageName: string;
};

type UploadState = "idle" | "hashing" | "uploading" | "saving" | "done" | "error";

export function UploadReleaseForm({ apps }: { apps: AppOption[] }) {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const disabled = state === "hashing" || state === "uploading" || state === "saving";
  const statusLabel = useMemo(() => {
    if (state === "hashing") return "Calculating APK hash";
    if (state === "uploading") return "Uploading APK";
    if (state === "saving") return "Saving release";
    if (state === "done") return "Release saved";
    return "";
  }, [state]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const file = form.get("apk") as File | null;
    const appId = String(form.get("appId") ?? "");
    const versionName = String(form.get("versionName") ?? "");
    const versionCode = Number(form.get("versionCode"));
    const channel = String(form.get("channel") ?? "STABLE");
    const changelog = String(form.get("changelog") ?? "");

    if (!file || file.size === 0) {
      setState("error");
      setMessage("Pilih file APK terlebih dahulu.");
      return;
    }

    try {
      setMessage("");
      setProgress(0);
      setState("hashing");
      const apkSha256 = await calculateSha256(file);

      setState("uploading");
      const uploadResponse = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          versionCode,
          fileName: file.name,
          contentType: file.type || "application/vnd.android.package-archive",
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error(await uploadResponse.text());
      }

      const { uploadUrl, objectKey } = (await uploadResponse.json()) as {
        uploadUrl: string;
        objectKey: string;
      };

      await uploadFile(uploadUrl, file, (nextProgress) => setProgress(nextProgress));

      setState("saving");
      const releaseResponse = await fetch("/api/admin/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          channel,
          versionName,
          versionCode,
          changelog,
          apkObjectKey: objectKey,
          apkSizeBytes: file.size,
          apkSha256,
          contentType: file.type || "application/vnd.android.package-archive",
        }),
      });

      if (!releaseResponse.ok) {
        throw new Error(await releaseResponse.text());
      }

      setState("done");
      setMessage("Release berhasil disimpan.");
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Upload gagal.");
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField select name="appId" label="App" required disabled={disabled || apps.length === 0}>
          {apps.map((app) => (
            <MenuItem key={app.id} value={app.id}>
              {app.name} - {app.packageName}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField name="versionName" label="Version name" required fullWidth disabled={disabled} />
          <TextField
            name="versionCode"
            label="Version code"
            type="number"
            required
            fullWidth
            disabled={disabled}
            inputProps={{ min: 1 }}
          />
          <TextField select name="channel" label="Channel" defaultValue="STABLE" fullWidth disabled={disabled}>
            <MenuItem value="STABLE">Stable</MenuItem>
            <MenuItem value="DEV">Dev</MenuItem>
          </TextField>
        </Stack>
        <TextField
          name="changelog"
          label="Changelog"
          multiline
          rows={3}
          disabled={disabled}
          inputProps={{ maxLength: 500 }}
        />
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={disabled}>
          Select APK
          <input name="apk" type="file" accept=".apk,application/vnd.android.package-archive" hidden />
        </Button>
        {disabled && (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {statusLabel}
            </Typography>
            <LinearProgress variant={state === "uploading" ? "determinate" : "indeterminate"} value={progress} />
          </Stack>
        )}
        {message && <Alert severity={state === "error" ? "error" : "success"}>{message}</Alert>}
        <Button type="submit" variant="contained" disabled={disabled || apps.length === 0}>
          Save Release
        </Button>
      </Stack>
    </Box>
  );
}

async function calculateSha256(file: File) {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function uploadFile(url: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type || "application/vnd.android.package-archive");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new Error(`R2 upload failed with status ${request.status}`));
      }
    };
    request.onerror = () => reject(new Error("R2 upload failed."));
    request.send(file);
  });
}
