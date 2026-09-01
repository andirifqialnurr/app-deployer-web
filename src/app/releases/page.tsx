import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { AppShell } from "@/components/app-shell";

export default function ReleasesPage() {
  return (
    <AppShell
      title="Releases"
      action={
        <Button variant="contained" startIcon={<CloudUploadIcon />}>
          Upload APK
        </Button>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Upload APK baru dengan versionCode yang lebih tinggi.
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body1">Belum ada release.</Typography>
        </Paper>
      </Stack>
    </AppShell>
  );
}
