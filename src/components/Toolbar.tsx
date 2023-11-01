import { useEffect, useState } from "react";
import { Contacts, Search } from "@mui/icons-material";
import {
  AppBar,
  Container,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useContact } from "@/context/Contact";
import Alert, { useAlert } from "./Alert";

export default function Searchbar() {
  const { setMode } = useContact();
  const [clicked, setClicked] = useState(0);
  const { alert, setAlert, onClose } = useAlert();

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

            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("search")}
            >
              <Search />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>

      <Alert alert={alert} onClose={onClose} />
    </>
  );
}
