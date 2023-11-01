import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import Meta from "@/components/Meta";
import Toolbar from "@/components/Toolbar";
import UpdateForm from "@/components/UpdateForm";
import DeleteForm from "@/components/DeleteForm";
import Bottombar from "@/components/Bottombar";
import ContactDetail from "@/components/ContactDetail";
import ContactList from "@/components/ContactList";
import SearchResult from "@/components/SearchResult";
import BulkDeleteForm from "@/components/BulkDeleteForm";

export default function Home() {
  const {
    isSearching,
    loadingFetch,
    list,
    favList,
    selectedFavOnly,
    selectedRegOnly,
  } = useContact();
  const { viewMode } = useTheme();

  return (
    <>
      <Meta title="Contact" description="List of contact" />

      <Box
        component="main"
        id="main"
        sx={{
          height: "100vh",
          width: "100vw",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: (theme) => theme.palette.background.default,
          py: "70px",
        }}
      >
        <Toolbar />
        <Container
          maxWidth="sm"
          sx={{ minHeight: "100%", position: "relative" }}
        >
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid item xs={12} sm={viewMode === "column" ? 6 : 12}>
              <ContactList
                label="Favorite"
                list={favList}
                countSelected={selectedFavOnly.length}
              />
            </Grid>

            <Grid item xs={12} sm={viewMode === "column" ? 6 : 12}>
              <ContactList
                label="Regular"
                list={list}
                countSelected={selectedRegOnly.length}
              />
            </Grid>
          </Grid>
          {loadingFetch && (
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
        </Container>
        <Bottombar />

        {isSearching && <SearchResult />}
      </Box>

      {/* Modals */}
      <ContactDetail />
      <UpdateForm />
      <DeleteForm />
      <BulkDeleteForm />
    </>
  );
}
