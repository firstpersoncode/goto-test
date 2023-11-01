import { Check } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export default function About() {
  return (
    <Box sx={{ py: 2 }}>
      <Alert>
        <AlertTitle>GOTO Contacts</AlertTitle>
        <Typography sx={{ fontSize: "12px" }}>
          The app is built with ReactJS and Next.js, using React Context for
          efficient global state management. Components remain lightweight,
          focusing on UI, and React Material UI enhances the user experience
          with a visually appealing interface.
        </Typography>
        <List>
          <ListItem disableGutters disablePadding>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <Check sx={{ fontSize: "16px" }} />
            </ListItemIcon>
            <ListItemText
              primary="Lists Contacts"
              primaryTypographyProps={{ sx: { fontSize: "12px" } }}
              secondary="The app provides a comprehensive list of contacts."
              secondaryTypographyProps={{
                sx: { fontSize: "10px" },
              }}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <Check sx={{ fontSize: "16px" }} />
            </ListItemIcon>
            <ListItemText
              primary="Toggle Favorites"
              primaryTypographyProps={{ sx: { fontSize: "12px" } }}
              secondary="Users can mark or unmark contacts as
                        favorites."
              secondaryTypographyProps={{
                sx: { fontSize: "10px" },
              }}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <Check sx={{ fontSize: "16px" }} />
            </ListItemIcon>
            <ListItemText
              primary="Create, Update, and Delete Contacts"
              primaryTypographyProps={{ sx: { fontSize: "12px" } }}
              secondary="The app offers
                        functionality to create new contacts, update existing
                        contact details, and remove contacts."
              secondaryTypographyProps={{
                sx: { fontSize: "10px" },
              }}
            />
          </ListItem>
        </List>
      </Alert>

      <Alert severity="info">
        <Typography
          sx={{
            fontSize: "10px",
            "& a": { color: (theme) => theme.palette.primary.main },
          }}
        >
          GitHub:{" "}
          <a
            href="https://github.com/firstpersoncode/goto-test"
            target="_blank"
          >
            https://github.com/firstpersoncode/goto-test
          </a>
        </Typography>
        <Typography
          sx={{
            fontSize: "10px",
            "& a": { color: (theme) => theme.palette.primary.main },
          }}
        >
          Dev Website:{" "}
          <a href="https://firstpersoncode.dev" target="_blank">
            https://firstpersoncode.dev
          </a>
        </Typography>
      </Alert>
    </Box>
  );
}
