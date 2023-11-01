import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import ContactList from "./ContactList";
import { useContact } from "@/context/Contact";

export default function SearchResult() {
  const {loadingSearch, searchResult } = useContact();

  return (
    <Container
      maxWidth="sm"
      sx={{
        pt: "70px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        zIndex: 100,
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <ContactList
        label="Result"
        list={searchResult}
        countSelected={searchResult.length}
        isSearchResult
      />

      {loadingSearch && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            pointerEvents: "none"
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
    </Container>
  );
}
