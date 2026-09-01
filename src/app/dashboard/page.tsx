import AppsIcon from "@mui/icons-material/Apps";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageIcon from "@mui/icons-material/Storage";
import { Grid, Stack, Typography } from "@mui/material";
import { AppShell } from "@/components/app-shell";
import { MobileClientCard } from "@/components/mobile-client-card";
import { StatCard } from "@/components/stat-card";
import { formatBytes } from "@/lib/format";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [appCount, releaseCount, storage] = await Promise.all([
    db.mobileApp.count({ where: { isActive: true } }),
    db.appRelease.count({ where: { isActive: true } }),
    db.appRelease.aggregate({
      where: { isActive: true },
      _sum: { apkSizeBytes: true },
    }),
  ]);

  return (
    <AppShell title="Dashboard">
      <Stack spacing={3}>
        <Typography variant="body1" color="text.secondary">
          Ringkasan distribusi APK personal.
        </Typography>
        <MobileClientCard />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard icon={<AppsIcon />} label="Apps" value={String(appCount)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={<CloudUploadIcon />} label="Releases" value={String(releaseCount)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={<StorageIcon />} label="Storage" value={formatBytes(storage._sum.apkSizeBytes ?? 0)} />
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
