import { Alert as MuiAlert, Portal, Snackbar, Typography } from "@mui/material";
import { useContact } from "@/context/Contact";
import Confirmation from "./Confirmation";
import { useState } from "react";

type AlertState = {
  open: boolean;
  severity: "info" | "success" | "error";
  message: string;
};

interface AlertProps {
  alert: AlertState;
  onClose: () => void;
}

export default function Alert({ alert, onClose }: AlertProps) {
  return (
    <Portal>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={alert.severity !== "error" ? 3000 : undefined}
        onClose={onClose}
        open={alert.open}
        message={<MuiAlert severity={alert.severity}>{alert.message}</MuiAlert>}
        sx={{
          zIndex: 1500,
          "& .MuiPaper-root": { p: 0 },
          "& .MuiSnackbarContent-message": { p: 0, flexGrow: 1 },
          "& .MuiAlert-message": { pr: 2 },
          "& .MuiAlert-icon": { ml: 1 },
        }}
      />
    </Portal>
  );
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    severity: "info",
    message: "",
  });

  const onClose = () => setAlert((v) => ({ ...v, open: false }));

  return { alert, setAlert, onClose };
};
