import {
  Checkbox,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Contact, useContact } from "@/context/Contact";
import ContactItem from "./ContactItem";

interface ContatcListProps {
  label: string;
  list: Contact[];
  countSelected: number;
  isSearchResult?: boolean;
}

export default function ContactList({
  label,
  list,
  countSelected,
  isSearchResult = false,
}: ContatcListProps) {
  const { selectedContacts, selectAllContacts } = useContact();

  let filterSelectedContacts = selectedContacts.filter((c) =>
    label === "Favorite" ? c.isFavorite : !c.isFavorite
  );

  return (
    <>
      <Paper
        sx={{
          px: 1,
          position: "sticky",
          top: 0,
          zIndex: 2,
          mb: -2
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          {!isSearchResult && list.length > 0 && (
            <Checkbox
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "14px", sm: "16px" },
                },
              }}
              checked={filterSelectedContacts.length === list.length}
              onChange={() => selectAllContacts(label)}
            />
          )}
          {list.length > 0 && (
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: "bold",
                color: (theme) => theme.palette.text.primary,
                py: 1,
              }}
            >
              {label}{" "}
              {countSelected > 0 &&
                `(${
                  !isSearchResult ? "selected" : "found"
                } ${countSelected} item${countSelected > 1 ? "s" : ""})`}
            </Typography>
          )}
        </Stack>
      </Paper>

      <List>
        {list.map((contact, i) => (
          <ListItem disablePadding key={i}>
            <ContactItem contact={contact} label={label} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
