import AndroidIcon from "@mui/icons-material/Android";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { getDeployerMobileConfig } from "@/lib/env";

export function MobileClientCard() {
  const config = getDeployerMobileConfig();

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AndroidIcon color="primary" />
          <Typography variant="h6">App Deployer Mobile</Typography>
          <Chip
            label={config.configured ? "Ready" : "Not configured"}
            color={config.configured ? "success" : "default"}
            size="small"
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Typography color="text.secondary">
            Version {config.versionName} ({config.versionCode})
          </Typography>
          <Typography color="text.secondary">
            Install sekali di HP client.
          </Typography>
        </Stack>
        <Button
          href="/api/deployer-mobile/download"
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={!config.configured}
          sx={{ alignSelf: "flex-start" }}
        >
          Download Mobile App
        </Button>
      </Stack>
    </Paper>
  );
}
