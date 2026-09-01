import AddIcon from "@mui/icons-material/Add";
import AndroidIcon from "@mui/icons-material/Android";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AppShell } from "@/components/app-shell";

export default function AppsPage() {
  return (
    <AppShell
      title="Apps"
      action={
        <Button variant="contained" startIcon={<AddIcon />}>
          New App
        </Button>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Kelola aplikasi Android dan release APK.
        </Typography>
        <Paper variant="outlined">
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
        </Paper>
      </Stack>
    </AppShell>
  );
}
