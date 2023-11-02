import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Delete } from "@mui/icons-material";
import { useContact } from "@/context/Contact";
import { useTheme } from "@/context/Theme";
import { useContactForm } from "@/libs/hooks";
import { getFullName } from "@/libs/utils";
import Confirmation from "./Confirmation";
import Alert, { useAlert } from "./Alert";

export default function UpdateForm() {
  const { form, setForm, onChange, addPhone, updatePhone, removePhone } =
    useContactForm();

  const { alert, setAlert, onClose } = useAlert();

  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [saveConfirmation, setSaveConfirmation] = useState(false);
  const { selectedContact, selectContact, mode, handleUpdateContact } =
    useContact();
  const { isMobile } = useTheme();
  const fullname = useMemo(() => getFullName(form), [form]);

  useEffect(() => {
    if (selectedContact) setForm({ ...selectedContact });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);

  return (
    <>
      {/** =================================== UPDATE MODAL =================================== */}

      <Dialog
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        open={Boolean(selectedContact) && mode === "update"}
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

        <DialogTitle>Update Contact</DialogTitle>
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

        {/** =================================== UPDATE FORM =================================== */}

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
          <Button
            variant="contained"
            onClick={() => {
              // verify first ...

              setSaveConfirmation(true);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/** =================================== PROMPTS =================================== */}

      <Confirmation
        title="Cancel updating contact?"
        open={cancelConfirmation}
        onYes={() => {
          setCancelConfirmation(false);
          selectContact(undefined);
        }}
        onNo={() => setCancelConfirmation(false)}
      >
        <Typography>You will lose your unsaved changes.</Typography>
      </Confirmation>

      <Confirmation
        title="Save changes?"
        open={saveConfirmation}
        onYes={async () => {
          if (selectedContact?.id) {
            try {
              await handleUpdateContact(selectedContact.id, form);
              setSaveConfirmation(false);
              setAlert({
                open: true,
                severity: "success",
                message: "Contact successfully updated!",
              });
            } catch (err: any) {
              setSaveConfirmation(false);

              setAlert({
                open: true,
                severity: "error",
                message: err.message?.toString() || err.toString(),
              });
            }
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
