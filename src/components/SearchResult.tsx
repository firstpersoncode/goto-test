import {
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContactList from "./ContactList";
import { useContact } from "@/context/Contact";
import { useEffect, useState } from "react";
import { Close, Search } from "@mui/icons-material";
import { useTheme } from "@/context/Theme";

export default function SearchResult() {
  const { loadingSearch, searchResult, mode, setMode, handleSearch } =
    useContact();
  const [displaySearch, setDisplaySearch] = useState("");
  const { isMobile } = useTheme();

  useEffect(() => {
    if (displaySearch) handleSearch(displaySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySearch]);

  return (
    <Dialog
      open={mode === "search"}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      onClose={() => setMode(undefined)}
    >
      <DialogTitle>Contact Search</DialogTitle>
      <IconButton
        onClick={() => setMode(undefined)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <Divider />

      {/** =================================== SEARCH FORM =================================== */}

      <Paper sx={{ p: 2, position: "sticky", top: 0 }}>
        <TextField
          autoFocus
          fullWidth
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 1,
          }}
          inputProps={{ sx: { fontSize: "12px" } }}
          InputLabelProps={{ sx: { fontSize: "12px" } }}
          label="Search ..."
          size="small"
          variant="outlined"
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
      </Paper>

      {/** =================================== SEARCH RESULT =================================== */}

      <DialogContent>
        <ContactList
          label="Result"
          list={searchResult}
          countSelected={searchResult.length}
          isSearchResult
        />
        {loadingSearch && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              textAlign: "center",
            }}
          >
            <CircularProgress />
            <Typography
              sx={{
                fontSize: "12px",
                color: (theme) => theme.palette.text.primary,
              }}
            >
              Loading
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
