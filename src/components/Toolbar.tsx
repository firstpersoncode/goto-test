import { useEffect, useState } from "react";
import { Close, Contacts, Search } from "@mui/icons-material";
import {
  AppBar,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useContact } from "@/context/Contact";
import Alert, { useAlert } from "./Alert";
import { useTheme } from "@/context/Theme";

export default function Searchbar() {
  const { handleSearch } = useContact();
  const [displaySearch, setDisplaySearch] = useState("");
  const [clicked, setClicked] = useState(0);
  const { alert, setAlert, onClose } = useAlert();
  const { viewMode } = useTheme();

  const autoScrollToList = (label: string) => {
    const main = document.getElementById("main");
    const list = document.getElementById(label);
    if (main && list)
      main.scrollTo({ top: list.offsetTop - 50, behavior: "smooth" });
  };

  useEffect(() => {
    handleSearch(displaySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySearch]);

  return (
    <>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Container maxWidth="lg">
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
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
              {viewMode !== "column" && (
                <ButtonGroup
                  size="small"
                  variant="contained"
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  <Button
                    sx={{ fontSize: { xs: "8px", md: "12px" } }}
                    onClick={() => autoScrollToList("regular")}
                  >
                    Regular
                  </Button>
                  <Button
                    sx={{ fontSize: { xs: "8px", md: "12px" } }}
                    onClick={() => autoScrollToList("favorite")}
                  >
                    Favorite
                  </Button>
                </ButtonGroup>
              )}
            </Stack>

            {/** =================================== SEARCH FORM =================================== */}

            <TextField
              fullWidth
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: 28,
                },
                maxWidth: 400,
              }}
              inputProps={{ sx: { fontSize: "12px" } }}
              InputLabelProps={{ sx: { fontSize: "12px" } }}
              placeholder="Search ..."
              size="small"
              // variant="outlined"
              value={displaySearch}
              onChange={(e) => setDisplaySearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Stack
                    sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}
                  >
                    {displaySearch && (
                      <IconButton
                        size="small"
                        onClick={() => setDisplaySearch("")}
                      >
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
