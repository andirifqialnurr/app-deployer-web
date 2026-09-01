import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AppShell } from "@/components/app-shell";
import { UploadReleaseForm } from "@/components/upload-release-form";
import { formatBytes, formatDate } from "@/lib/format";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const [apps, releases] = await Promise.all([
    db.mobileApp.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, packageName: true },
    }),
    db.appRelease.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { app: true },
    }),
  ]);

  return (
    <AppShell
      title="Releases"
      action={
        <Button href="#upload-apk" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload APK
        </Button>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Upload APK baru dengan versionCode yang lebih tinggi.
        </Typography>
        <Paper id="upload-apk" variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Upload APK</Typography>
            <UploadReleaseForm apps={apps} />
          </Stack>
        </Paper>
        <Paper variant="outlined">
          {releases.length === 0 ? (
            <Typography sx={{ p: 3 }} variant="body1">
              Belum ada release.
            </Typography>
          ) : (
            <List>
              {releases.map((release) => (
                <ListItem key={release.id} divider>
                  <ListItemText
                    primary={`${release.app.name} v${release.versionName} (${release.versionCode})`}
                    secondary={`${release.app.packageName} - ${formatBytes(release.apkSizeBytes)} - ${formatDate(release.createdAt)}`}
                  />
                  <Chip label={release.channel.toLowerCase()} size="small" />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Stack>
    </AppShell>
  );
}
