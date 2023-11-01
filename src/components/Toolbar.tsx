import { useEffect, useState } from "react";
import { Close, Contacts, Search } from "@mui/icons-material";
import {
  AppBar,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContact } from "@/context/Contact";
import Alert, { useAlert } from "./Alert";

export default function Searchbar() {
  const { handleSearch } = useContact();
  const [displaySearch, setDisplaySearch] = useState("");
  const [clicked, setClicked] = useState(0);
  const { alert, setAlert, onClose } = useAlert();

  useEffect(() => {
    handleSearch(displaySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySearch]);

  return (
    <>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Container maxWidth="sm">
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              gap: 2,
            }}
          >
            {/** =================================== HEADER ICON =================================== */}

            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  if (clicked >= 1) {
                    setAlert({
                      open: true,
                      message: `${
                        11 - clicked
                      } more click before you meet the guy behind this`,
                      severity: "info",
                    });
                  }
                  if (clicked === 10) {
                    setClicked(0);
                    return window.open("https://firstpersoncode.dev", "_blank");
                  }
                  setClicked((v) => v + 1);
                }}
              >
                <Contacts />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "block" },
                }}
              >
                GOTO Phonebook
              </Typography>
            </Stack>

            {/** =================================== SEARCH FORM =================================== */}

            <TextField
          fullWidth
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 1,
          }}
          inputProps={{ sx: { fontSize: "12px" } }}
          InputLabelProps={{ sx: { fontSize: "12px" } }}
          label="Search ..."
          size="small"
          variant="filled"
          value={displaySearch}
          onChange={(e) => setDisplaySearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <Stack
                sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}
              >
                {displaySearch && (
                  <IconButton size="small" onClick={() => setDisplaySearch("")}>
                    <Close sx={{ fontSize: "16px" }} />
                  </IconButton>
                )}
                <IconButton size="small" edge="end">
                  <Search sx={{ fontSize: "16px" }} />
                </IconButton>
              </Stack>
            ),
          }}
        />
          </Stack>
        </Container>
      </AppBar>

      <Alert alert={alert} onClose={onClose} />
    </>
  );
}
