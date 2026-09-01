"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteResourceButton({
  endpoint,
  label,
  confirmText,
}: {
  endpoint: string;
  label: string;
  confirmText: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmText)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      color="error"
      disabled={loading}
      onClick={handleDelete}
      size="small"
      startIcon={<DeleteIcon />}
      variant="outlined"
    >
      {loading ? "Deleting" : label}
    </Button>
  );
}
