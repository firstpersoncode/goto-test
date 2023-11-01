import {
  AppBar,
  Container,
  Fab,
  IconButton,
  Slide,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Star, ViewColumn, ViewStream } from "@mui/icons-material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import { useScrolled } from "@/libs/hooks";
import CreateForm from "./CreateForm";
import { useMemo } from "react";

export default function Bottombar() {
  const {
    isSearching,
    selectedContacts,
    bulkToggleFavorites,
    setMode,
    selectedFavOnly,
    selectedRegOnly,
  } = useContact();
  const { colorMode, toggleColorMode, viewMode, toggleViewMode, isMobile } =
    useTheme();
  const scrolled = useScrolled();

  const favOnly = useMemo(
    () => Boolean(selectedFavOnly.length && !selectedRegOnly.length),
    [selectedFavOnly, selectedRegOnly]
  );
  const regOnly = useMemo(
    () => Boolean(!selectedFavOnly.length && selectedRegOnly.length),
    [selectedFavOnly, selectedRegOnly]
  );

  const display = !isMobile || Boolean(selectedContacts.length) || !scrolled;

  return (
    <Slide appear={false} direction="up" in={!isSearching && display}>
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/** =================================== TOOLS =================================== */}

          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Tooltip title={colorMode}>
              <Switch
                color="error"
                checked={colorMode === "light"}
                onChange={toggleColorMode}
              />
            </Tooltip>

            <Tooltip title={viewMode}>
              <IconButton
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
                onClick={toggleViewMode}
              >
                {viewMode === "stream" ? <ViewStream /> : <ViewColumn />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            {selectedContacts.length > 0 && (
              <>
                <Tooltip
                  title={`Delete ${selectedContacts.length} contact${
                    selectedContacts.length > 1 ? "s" : ""
                  }`}
                >
                  <IconButton onClick={() => setMode("bulk-delete")}>
                    <Delete />
                  </IconButton>
                </Tooltip>

                {(favOnly || regOnly) && (
                  <Tooltip
                    title={`${
                      favOnly
                        ? `Remove ${selectedContacts.length} contact${
                            selectedContacts.length > 1 ? "s" : ""
                          } from`
                        : `Add ${selectedContacts.length} contact${
                            selectedContacts.length > 1 ? "s" : ""
                          } to`
                    } favorite`}
                  >
                    <IconButton
                      color={favOnly ? undefined : "warning"}
                      onClick={() => bulkToggleFavorites()}
                    >
                      <Star />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}

            {/** =================================== CREATE ACTION =================================== */}
            <Tooltip title="Create Contact">
              <Fab
                onClick={() => {
                  setMode("create");
                }}
                color="error"
                sx={{
                  mt: -5,
                  width: { xs: 70, sm: 65 },
                  height: { xs: 70, sm: 65 },
                  position: { xs: "absolute", sm: "relative" },
                  mx: "auto",
                  left: 0,
                  right: 0,
                }}
              >
                <Add />
              </Fab>
            </Tooltip>
          </Stack>
        </Container>
      </AppBar>
    </Slide>
  );
}
