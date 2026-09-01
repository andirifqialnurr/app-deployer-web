import AndroidIcon from "@mui/icons-material/Android";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DeleteResourceButton } from "@/components/delete-resource-button";
import { formatBytes, formatDate } from "@/lib/format";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await db.mobileApp.findUnique({
    where: { id },
    include: {
      releases: {
        orderBy: { versionCode: "desc" },
      },
    },
  });

  if (!app) {
    notFound();
  }

  return (
    <AppShell
      title={app.name}
      action={
        <Stack direction="row" spacing={1}>
          <Button href="/releases#upload-apk" variant="contained" startIcon={<CloudDownloadIcon />}>
            Upload APK
          </Button>
          <DeleteResourceButton
            endpoint={`/api/admin/apps/${app.id}`}
            label="Delete App"
            confirmText={`Hapus ${app.name} dan semua release APK-nya?`}
          />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AndroidIcon color="primary" />
              <Typography variant="h6">{app.packageName}</Typography>
            </Stack>
            {app.description && (
              <Typography color="text.secondary">{app.description}</Typography>
            )}
          </Stack>
        </Paper>

        <Paper variant="outlined">
          <Stack spacing={0}>
            <Typography variant="h6" sx={{ p: 3, pb: 2 }}>
              Releases
            </Typography>
            <Divider />
            {app.releases.length === 0 ? (
              <Typography sx={{ p: 3 }} color="text.secondary">
                Belum ada release.
              </Typography>
            ) : (
              <List>
                {app.releases.map((release) => (
                  <ListItem key={release.id} divider>
                    <ListItemText
                      primary={`v${release.versionName} (${release.versionCode})`}
                      secondary={`${formatBytes(release.apkSizeBytes)} - ${formatDate(release.createdAt)}`}
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={release.channel.toLowerCase()} size="small" />
                      <Button
                        href={`/api/releases/${release.id}/download`}
                        size="small"
                        variant="outlined"
                      >
                        Download
                      </Button>
                      <DeleteResourceButton
                        endpoint={`/api/admin/releases/${release.id}`}
                        label="Delete"
                        confirmText={`Hapus release v${release.versionName}?`}
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </Paper>
      </Stack>
    </AppShell>
  );
}
