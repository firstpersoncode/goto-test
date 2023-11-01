import { Typography } from "@mui/material";
import { useContact } from "@/context/Contact";
import Confirmation from "./Confirmation";
import Alert, { useAlert } from "./Alert";

export default function BulkDeleteForm() {
  const { selectedContacts, mode, setMode, handleBulkDeleteContact } =
    useContact();
  const { alert, setAlert, onClose } = useAlert();

  return (
    <>
      <Confirmation
        title="Deleting contacts"
        open={Boolean(selectedContacts.length) && mode === "bulk-delete"}
        onNo={() => setMode(undefined)}
        onYes={async () => {
          try {
            await handleBulkDeleteContact();
            setAlert({
              open: true,
              severity: "success",
              message: `Successfully deleted ${selectedContacts.length}`,
            });
          } catch (err: any) {
            console.error(err);
            setAlert({
              open: true,
              severity: "error",
              message: err.message?.toString() || err.toString(),
            });
          }
        }}
      >
        <Typography>
          Are you sure you want to delete {selectedContacts.length} contact
          {selectedContacts.length > 1 ? "s" : ""}
        </Typography>
      </Confirmation>

      <Alert alert={alert} onClose={onClose} />
    </>
  );
}
