import { Paper, Stack, Typography } from "@mui/material";
import { AppShell } from "@/components/app-shell";
import { getStorageProviderLabel } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Konfigurasi runtime dibaca dari environment server.
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle2">Storage provider</Typography>
          <Typography color="text.secondary">{getStorageProviderLabel()}</Typography>
        </Paper>
      </Stack>
    </AppShell>
  );
}
