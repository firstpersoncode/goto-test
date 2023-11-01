import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Delete, Edit, Star } from "@mui/icons-material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import { getFullName } from "@/libs/utils";

export default function ContactDetail() {
  const { selectedContact, selectContact, mode, setMode, toggleFavorite } =
    useContact();
  const { isMobile } = useTheme();
  const fullname = useMemo(
    () => getFullName(selectedContact),
    [selectedContact]
  );

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
      open={Boolean(selectedContact) && mode === "read"}
      onClose={() => selectContact(undefined)}
    >
      {/** =================================== HEADER =================================== */}

      <Stack sx={{ flexDirection: "row", alignItems: "flex-start", p: 2, flexWrap: "wrap", gap: 2 }}>
        <Tooltip
          title={
            selectedContact?.isFavorite
              ? "Remove from favorite"
              : "Add to favorite"
          }
        >
          <IconButton
            size="small"
            onClick={() =>
              selectedContact?.id && toggleFavorite(selectedContact.id)
            }
          >
            <Star color={selectedContact?.isFavorite ? "warning" : undefined} />
          </IconButton>
        </Tooltip>
        <DialogTitle sx={{ p: 0, width: "80%" }}>{fullname}</DialogTitle>
      </Stack>
      <IconButton
        onClick={() => selectContact(undefined)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <Divider />

      {/** =================================== CONTACT INFO =================================== */}

      <DialogContent>
        {selectedContact?.phones.map((phone, i) => (
          <Box key={i} sx={{ my: 1 }}>
            <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Typography sx={{ fontSize: "10px", mb: 0 }}>
                Phone number
                {selectedContact?.phones.length > 1 ? ` ${i + 1}` : ""}
              </Typography>
              {selectedContact?.phones.length > 1 && i === 0 && (
                <Chip
                  color="primary"
                  size="small"
                  sx={{ fontSize: "8px" }}
                  label="Primary"
                />
              )}
            </Stack>
            <Typography>{phone.number}</Typography>
          </Box>
        ))}
      </DialogContent>
      <Divider />

      {/** =================================== ACTIONS =================================== */}

      <DialogActions>
        <Button
          startIcon={<Delete />}
          color="error"
          onClick={() => {
            setMode("delete");
          }}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          color="primary"
          onClick={() => {
            setMode("update");
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
