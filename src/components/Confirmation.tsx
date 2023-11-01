import { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface ConfirmationProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onYes: () => void | Promise<void>;
  onNo: () => void;
}

export default function Confirmation({
  title,
  children,
  open,
  onYes,
  onNo,
}: ConfirmationProps) {
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onNo}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={onNo}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <Divider />
      <DialogContent>{children}</DialogContent>
      <Divider />
      <DialogActions>
        <Button size="small" color="error" onClick={onNo}>
          No
        </Button>
        <Button size="small" variant="contained" onClick={onYes}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
