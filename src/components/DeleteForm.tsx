import { useMemo } from "react";
import { Typography } from "@mui/material";
import { useContact } from "@/context/Contact";
import { getFullName } from "@/libs/utils";
import Confirmation from "./Confirmation";
import Alert, { useAlert } from "./Alert";

export default function DeleteForm() {
  const { selectedContact, selectContact, mode, handleDeleteContact } =
    useContact();
  const { alert, setAlert, onClose } = useAlert();
  const fullname = useMemo(
    () => getFullName(selectedContact),
    [selectedContact]
  );

  return (
    <>
      <Confirmation
        title="Deleting contact"
        open={Boolean(selectedContact) && mode === "delete"}
        onNo={() => selectContact(undefined)}
        onYes={async () => {
          if (selectedContact?.id) {
            try {
              await handleDeleteContact(selectedContact.id);
              selectContact(undefined);
              setAlert({
                open: true,
                severity: "success",
                message: "Contact successfully deleted",
              });
            } catch (err: any) {
              console.error(err);

              setAlert({
                open: true,
                severity: "error",
                message: err.message?.toString() || err.toString(),
              });
            }
          }
        }}
      >
        <Typography>
          Are you sure you want to delete
          <br />
          &quot;{fullname}&quot; ?
        </Typography>
      </Confirmation>
      <Alert alert={alert} onClose={onClose} />
    </>
  );
}
