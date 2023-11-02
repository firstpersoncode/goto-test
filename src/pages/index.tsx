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
import CreateForm from "@/components/CreateForm";
import UpdateForm from "@/components/UpdateForm";
import DeleteForm from "@/components/DeleteForm";
import Bottombar from "@/components/Bottombar";
import ContactDetail from "@/components/ContactDetail";
import ContactList from "@/components/ContactList";
import BulkDeleteForm from "@/components/BulkDeleteForm";
import About from "@/components/About";

export default function Home() {
  const {
    searchResult,
    isSearching,
    loadingFetch,
    loadingSearch,
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
          pb: "55px",
        }}
      >
        <Toolbar />
        <Container
          maxWidth="lg"
          sx={{ minHeight: "100%", position: "relative" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={2}>
                {isSearching ? (
                  <Grid item xs={12}>
                    <ContactList
                      label="Result"
                      list={searchResult}
                      countSelected={searchResult.length}
                      isSearchResult
                    />
                  </Grid>
                ) : (
                  <>
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
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Box sx={{ position: "sticky", top: 60 }}>
                {/* Modals */}
                <ContactDetail />
                <CreateForm />
                <UpdateForm />
                <DeleteForm />
                <BulkDeleteForm />

                <About />
              </Box>
            </Grid>
          </Grid>

          {(loadingFetch || loadingSearch) && (
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
      </Box>
    </>
  );
}
