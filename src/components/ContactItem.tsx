import { BaseSyntheticEvent, useMemo, useState } from "react";
import {
  Add,
  CheckBox,
  Delete,
  Edit,
  MoreVert,
  Remove,
  Star,
} from "@mui/icons-material";
import {
  Card,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContact, type Contact } from "@/context/Contact";
import { useDetectShiftKey } from "@/libs/hooks";
import { getFullName } from "@/libs/utils";

interface ContactItemProps {
  contact: Contact;
  label: string;
}

export default function ContactItem({ contact, label }: ContactItemProps) {
  const [openOptions, setOpenOptions] = useState(null as Element | null);
  const {
    selectedContacts,
    selectContact,
    selectContacts,
    setMode,
    toggleFavorite,
  } = useContact();
  const fullname = useMemo(() => getFullName(contact), [contact]);
  const phone = useMemo(() => contact.phones[0]?.number, [contact.phones]);

  const includedInSelectedContacts = useMemo(
    () => Boolean(selectedContacts.find((c) => c.id === contact.id)),
    [selectedContacts, contact]
  );

  const shiftHeld = useDetectShiftKey();

  return (
    <Card sx={{ flexGrow: 1, my: 1, px: 1 }} variant="outlined">
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        {label !== "Result" && (
          <Tooltip title="Hold Shift key to perform bulk selection">
            <Checkbox
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "14px", sm: "16px" },
                },
              }}
              checked={includedInSelectedContacts}
              onChange={() => selectContacts(contact.id, label, shiftHeld)}
            />
          </Tooltip>
        )}

        {contact.isFavorite && (
          <ListItemIcon sx={{ minWidth: 0 }}>
            <Star
              color="warning"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            />
          </ListItemIcon>
        )}

        {/** =================================== CONTACT INFO =================================== */}

        <ListItemButton
          sx={{ flexGrow: 1, gap: 1, p: 1 }}
          onClick={() => {
            selectContact(contact.id);
            setMode("read");
          }}
        >
          <Stack sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              {fullname}
            </Typography>

            <Typography sx={{ fontSize: { xs: "8px", sm: "10px" } }}>
              {phone}
              {contact.phones.length > 1
                ? ` and ${contact.phones.length - 1} more...`
                : ""}
            </Typography>
          </Stack>
        </ListItemButton>

        {/** =================================== ACTIONS =================================== */}

        <Tooltip title="More">
          <IconButton
            size="small"
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "14px", sm: "16px" },
              },
            }}
            onClick={(e: BaseSyntheticEvent) => setOpenOptions(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(openOptions)}
          anchorEl={openOptions}
          onClose={() => setOpenOptions(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem disablePadding disableGutters>
              <ListItemButton
                sx={{ gap: 1 }}
                onClick={() => {
                  selectContact(contact.id);
                  setMode("update");
                  setOpenOptions(null);
                }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Edit sx={{ fontSize: "16px" }} />
                </ListItemIcon>
                <Typography sx={{ fontSize: "12px" }}>Edit</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding disableGutters>
              <ListItemButton
                sx={{ gap: 1 }}
                onClick={() => {
                  selectContact(contact.id);
                  setMode("delete");
                  setOpenOptions(null);
                }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Delete sx={{ fontSize: "16px" }} />
                </ListItemIcon>
                <Typography sx={{ fontSize: "12px" }}>Delete</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding disableGutters>
              <ListItemButton
                sx={{ gap: 1 }}
                onClick={() => {
                  toggleFavorite(contact.id);
                  setOpenOptions(null);
                }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {contact.isFavorite ? (
                    <Remove sx={{ fontSize: "16px" }} />
                  ) : (
                    <Add sx={{ fontSize: "16px" }} />
                  )}
                </ListItemIcon>
                <Typography sx={{ fontSize: "12px" }}>
                  {contact.isFavorite
                    ? "Remove from favorite"
                    : "Add to favorite"}
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Popover>
      </Stack>
    </Card>
  );
}
