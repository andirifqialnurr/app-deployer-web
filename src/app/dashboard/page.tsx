import AppsIcon from "@mui/icons-material/Apps";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageIcon from "@mui/icons-material/Storage";
import { Grid, Stack, Typography } from "@mui/material";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <Stack spacing={3}>
        <Typography variant="body1" color="text.secondary">
          Ringkasan distribusi APK personal.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard icon={<AppsIcon />} label="Apps" value="0" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={<CloudUploadIcon />} label="Releases" value="0" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={<StorageIcon />} label="Storage" value="0 GB" />
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
