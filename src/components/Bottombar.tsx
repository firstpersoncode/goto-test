import {
  AppBar,
  Container,
  IconButton,
  Slide,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { Delete, Star, ViewColumn, ViewStream } from "@mui/icons-material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import { useScrolled } from "@/libs/hooks";
import CreateForm from "./CreateForm";
import { useMemo } from "react";

export default function Bottombar() {
  const {
    selectedContacts,
    bulkToggleFavorites,
    setMode,
    selectedFavOnly,
    selectedRegOnly,
  } = useContact();
  const { colorMode, toggleColorMode, viewMode, toggleViewMode } = useTheme();
  const scrolled = useScrolled();

  const favOnly = useMemo(
    () => Boolean(selectedFavOnly.length && !selectedRegOnly.length),
    [selectedFavOnly, selectedRegOnly]
  );
  const regOnly = useMemo(
    () => Boolean(!selectedFavOnly.length && selectedRegOnly.length),
    [selectedFavOnly, selectedRegOnly]
  );

  return (
    <Slide
      appear={false}
      direction="up"
      in={Boolean(selectedContacts.length) || !scrolled}
    >
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
          maxWidth="sm"
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
            <CreateForm />
          </Stack>
        </Container>
      </AppBar>
    </Slide>
  );
}
