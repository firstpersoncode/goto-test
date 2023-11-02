import { useMemo, useState } from "react";
import { Add, Close, Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import { useContactForm } from "@/libs/hooks";
import { getFullName } from "@/libs/utils";
import Confirmation from "./Confirmation";
import Alert, { useAlert } from "./Alert";

export default function CreateForm() {
  const {
    form,
    defaultForm,
    setForm,
    onChange,
    addPhone,
    updatePhone,
    removePhone,
  } = useContactForm();

  const { alert, setAlert, onClose } = useAlert();
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [saveConfirmation, setSaveConfirmation] = useState(false);

  const { mode, setMode, handleInsertContact, loadingInsert } = useContact();
  const { isMobile } = useTheme();
  const fullname = useMemo(() => getFullName(form), [form]);

  return (
    <>
      {/** =================================== CREATE MODAL =================================== */}

      <Dialog
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        open={mode === "create"}
        onClose={() => setCancelConfirmation(true)}
        disablePortal={!isMobile}
        disableScrollLock={!isMobile}
        hideBackdrop={!isMobile}
        disableEnforceFocus={!isMobile}
        sx={{
          position: { xs: "fixed", md: "static" },
          "& .MuiPaper-root": {
            maxHeight: { xs: "calc(100% - 64px)", md: "80vh" },
            mx: 0,
            my: 2,
            width: "100%",
            boxShadow: (theme) => theme.shadows["1"],
          },
        }}
      >
        {/** =================================== HEADER =================================== */}

        <DialogTitle>Create Contact</DialogTitle>
        <IconButton
          onClick={() => setCancelConfirmation(true)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <Divider />
        {loadingInsert && <LinearProgress />}

        {/** =================================== CREATE FORM =================================== */}

        <DialogContent>
          <TextField
            fullWidth
            name="first_name"
            label="First Name"
            value={form.first_name}
            onChange={onChange}
            sx={{ my: 1 }}
          />

          <TextField
            fullWidth
            name="last_name"
            label="Last Name"
            value={form.last_name}
            onChange={onChange}
            sx={{ my: 1 }}
          />

          {/** =================================== PHONES FORM =================================== */}

          {form.phones.map((phone, i) => (
            <Stack sx={{ flexDirection: "row", gap: 1, my: 1 }} key={i}>
              <TextField
                fullWidth
                name="number"
                label={`Phone number${
                  form.phones.length > 1
                    ? ` ${i === 0 ? " (Primary)" : i + 1}`
                    : ""
                }`}
                value={phone.number}
                onChange={updatePhone(i)}
              />
              {i !== 0 && (
                <IconButton
                  sx={{ width: "50px", height: "50px" }}
                  size="small"
                  onClick={removePhone(i)}
                >
                  <Delete />
                </IconButton>
              )}
            </Stack>
          ))}

          <Button
            sx={{ my: 2 }}
            fullWidth
            startIcon={<Add />}
            onClick={addPhone}
          >
            Add Another Number
          </Button>
        </DialogContent>
        <Divider />

        {/** =================================== ACTIONS =================================== */}

        <DialogActions>
          <Button onClick={() => setCancelConfirmation(true)} color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setSaveConfirmation(true)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/** =================================== PROMPTS =================================== */}

      <Confirmation
        title="Cancel creating new contact?"
        open={cancelConfirmation}
        onYes={() => {
          setCancelConfirmation(false);
          setMode(undefined);
        }}
        onNo={() => setCancelConfirmation(false)}
      >
        <Typography>You will lose your unsaved changes.</Typography>
      </Confirmation>

      <Confirmation
        title="New contact?"
        open={saveConfirmation}
        onYes={async () => {
          try {
            await handleInsertContact(form);
            setSaveConfirmation(false);
            setMode(undefined);
            setForm(defaultForm);

            setAlert({
              open: true,
              severity: "success",
              message: "New contact successfully created!",
            });
          } catch (err: any) {
            setSaveConfirmation(false);

            setAlert({
              open: true,
              severity: "error",
              message: err.message?.toString() || err.toString(),
            });
          }
        }}
        onNo={() => setSaveConfirmation(false)}
      >
        <Typography>&quot;{fullname}&quot;</Typography>
      </Confirmation>

      <Alert alert={alert} onClose={onClose} />
    </>
  );
}
