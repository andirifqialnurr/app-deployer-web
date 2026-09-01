import AddIcon from "@mui/icons-material/Add";
import AndroidIcon from "@mui/icons-material/Android";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createAppAction } from "@/server/actions/apps";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const apps = await db.mobileApp.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      releases: {
        where: { isActive: true },
        orderBy: { versionCode: "desc" },
        take: 1,
      },
    },
  });

  return (
    <AppShell
      title="Apps"
      action={
        <Button href="#new-app" variant="contained" startIcon={<AddIcon />}>
          New App
        </Button>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Kelola aplikasi Android dan release APK.
        </Typography>
        <Paper variant="outlined">
          {apps.length === 0 ? (
            <List>
              <ListItem>
                <ListItemIcon>
                  <AndroidIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Belum ada app"
                  secondary="Tambahkan app pertama sebelum upload APK."
                />
              </ListItem>
            </List>
          ) : (
            <List>
              {apps.map((app) => {
                const release = app.releases[0];
                return (
                  <ListItem key={app.id} divider>
                    <ListItemIcon>
                      <AndroidIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={app.name}
                      secondary={
                        release
                          ? `${app.packageName} - v${release.versionName} (${release.versionCode})`
                          : app.packageName
                      }
                    />
                    <Button
                      component={Link}
                      href={`/apps/${app.id}`}
                      endIcon={<OpenInNewIcon />}
                      size="small"
                    >
                      Detail
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
        <Paper id="new-app" variant="outlined" sx={{ p: 3 }}>
          <Box component="form" action={createAppAction}>
            <Stack spacing={2}>
              <Typography variant="h6">New App</Typography>
              <TextField name="name" label="App name" required />
              <TextField name="packageName" label="Package name" required />
              <TextField name="description" label="Description" inputProps={{ maxLength: 240 }} />
              <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                Save App
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </AppShell>
  );
}
