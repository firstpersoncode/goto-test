import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  findById,
  handleBulkDeselect,
  handleBulkSelect,
  saveFavList,
  sortyByFirstName,
  updateList,
} from "@/libs/utils";
import { useDetectScrolledToBottom } from "@/libs/hooks";
import { useTheme } from "../Theme";
import {
  ContactInput,
  PhoneInput,
  useContactMutations,
  useContactQueries,
} from "./hooks";

/** =================================== TYPES =================================== */

export type Phone = {
  id: number;
  contact_id: number;
  number: string;
};

export type Contact = {
  id: number;
  first_name: string;
  last_name?: string;
  phones: Phone[];
  isFavorite?: boolean;
};

export type ContactFormInput = ContactInput & { phones: PhoneInput[] };

type Mode =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "bulk-delete"
  | "search"
  | undefined;

interface ContactContext {
  loadingFetch: boolean;
  loadingSearch: boolean;
  loadingInsert: boolean;
  list: Contact[];
  favList: Contact[];
  searchResult: Contact[];
  selectedContact: Contact | undefined;
  selectedContacts: Contact[];
  selectedFavOnly: Contact[];
  selectedRegOnly: Contact[];
  mode: Mode;

  handleInsertContact: (contact: ContactFormInput) => Promise<void>;
  handleUpdateContact: (
    contactId: number,
    contact: ContactFormInput
  ) => Promise<void>;
  handleDeleteContact: (contactId: number) => Promise<void>;
  handleBulkDeleteContact: () => Promise<void>;
  handleSearch: (s: string) => void;

  toggleFavorite: (contactId: number) => void;
  bulkToggleFavorites: () => void;
  selectContact: (contactId: number | undefined) => void;
  selectContacts: (
    contactId: number,
    label: string,
    shiftHeld: boolean
  ) => void;
  selectAllContacts: (label: string) => void;
  setMode: Dispatch<SetStateAction<Mode>>;
}

interface ContactProviderProps {
  children: ReactNode;
}

/** =================================== PROVIDER =================================== */

const initialContext: ContactContext = {
  loadingFetch: false,
  loadingSearch: false,
  loadingInsert: false,
  list: [],
  favList: [],
  searchResult: [],
  selectedContact: undefined,
  selectedContacts: [],
  selectedFavOnly: [],
  selectedRegOnly: [],
  mode: "read",
  handleInsertContact: async (_: ContactFormInput) => {},
  handleUpdateContact: async (_: number, _contact: ContactFormInput) => {},
  handleDeleteContact: async (_: number) => {},
  handleBulkDeleteContact: async () => {},
  handleSearch: (_: string) => {},
  toggleFavorite: (_: number) => {},
  bulkToggleFavorites: () => {},
  selectContact: (_: number | undefined) => {},
  selectContacts: (_: number, _label: string, _shiftHeld: boolean) => {},
  selectAllContacts: (_: string) => {},
  setMode: () => {},
};

const Contact = createContext<ContactContext>(initialContext);

export const useContact = () => useContext(Contact);

export default function ContactProvider({ children }: ContactProviderProps) {
  {
    /** =================================== STATES =================================== */
  }
  const { isClient } = useTheme();

  const [contacts, setContacts] = useState(initialContext.list);
  const [searchResult, setSearchResult] = useState(initialContext.searchResult);
  const [selectedContact, setSelectedContact] = useState(
    initialContext.selectedContact
  );
  const [selectedContacts, setSelectedContacts] = useState(
    initialContext.selectedContacts
  );
  const [mode, setMode] = useState(initialContext.mode);
  const [queryVariables, setQueryVariables] = useState({
    offset: 0,
    limit: 15,
  });
  const list = useMemo(
    () => sortyByFirstName(contacts.filter((contact) => !contact.isFavorite)),
    [contacts]
  );
  const favList = useMemo(
    () => sortyByFirstName(contacts.filter((contact) => contact.isFavorite)),
    [contacts]
  );
  const selectedFavOnly = useMemo(
    () => selectedContacts.filter((contact) => contact.isFavorite),
    [selectedContacts]
  );
  const selectedRegOnly = useMemo(
    () => selectedContacts.filter((contact) => !contact.isFavorite),
    [selectedContacts]
  );

  const isBottom = useDetectScrolledToBottom(); // pagination purpose

  {
    /** =================================== QUERIES + MUTATIONS =================================== */
  }

  const { loadingFetch, loadingSearch, handleSearch, handleGetContact } =
    useContactQueries({ dispatchers: { setContacts, setSearchResult } });

  const {
    loadingInsert,
    handleInsertContact,
    handleUpdateContact,
    handleDeleteContact,
    handleBulkDeleteContact,
  } = useContactMutations({
    context: { selectedContact, selectedContacts },
    dispatchers: { setContacts, setSearchResult, setSelectedContacts },
  });

  {
    /** =================================== DISPATCHERS =================================== */
  }

  const toggleFavorite = (contactId: number) => {
    setContacts((currContacts) => {
      let updatedContacts = updateList(currContacts, contactId, (contact) => ({
        isFavorite: !contact.isFavorite,
      }));

      if (selectedContact) {
        let contact = findById(updatedContacts, selectedContact.id);
        setSelectedContact(contact);
      }
      saveFavList(updatedContacts);
      return updatedContacts;
    });

    // in case we have list in search result
    setSearchResult((currContacts) => {
      let updatedContacts = updateList(currContacts, contactId, (contact) => ({
        isFavorite: !contact.isFavorite,
      }));

      return updatedContacts;
    });
  };

  const bulkToggleFavorites = () => {
    setContacts((currContacts) => {
      let updatedContacts = currContacts.map((contact) => {
        let selected = findById(selectedContacts, contact.id);
        if (selected) return { ...contact, isFavorite: !contact.isFavorite };
        return contact;
      });
      saveFavList(updatedContacts);
      return updatedContacts;
    });

    // in case we have list in search result
    setSearchResult((currContacts) => {
      let updatedContacts = currContacts.map((contact) => {
        let selected = findById(selectedContacts, contact.id);
        if (selected) return { ...contact, isFavorite: !contact.isFavorite };
        return contact;
      });
      return updatedContacts;
    });

    setSelectedContacts([]);
  };

  const selectContact = (contactId: number | undefined) => {
    if (typeof contactId === "undefined") return setSelectedContact(undefined);
    let contact =
      findById(contacts, contactId) || findById(searchResult, contactId);
    if (contact) setSelectedContact(contact);
  };

  const selectContacts = (
    contactId: number,
    label: string,
    shiftHeld: boolean = false
  ) => {
    let filterContacts = contacts.filter((c) =>
      label === "Favorite" ? c.isFavorite : !c.isFavorite
    );

    const contact = findById(filterContacts, contactId);
    if (contact)
      setSelectedContacts((v) => {
        let currSelectedContacts = [...v];
        let index = currSelectedContacts.findIndex((c) => c.id === contact.id);
        if (index !== -1)
          currSelectedContacts = handleBulkDeselect({
            selectedContacts: currSelectedContacts,
            contacts: filterContacts,
            contact,
            index,
            shiftHeld,
          });
        else
          currSelectedContacts = handleBulkSelect({
            selectedContacts: currSelectedContacts,
            contacts: filterContacts,
            contact,
            shiftHeld,
          });
        return currSelectedContacts;
      });
  };

  const selectAllContacts = (label: string) => {
    let filterContacts = contacts.filter((c) =>
      label === "Favorite" ? c.isFavorite : !c.isFavorite
    );

    let filterSelectedContacts = selectedContacts.filter((c) =>
      label === "Favorite" ? c.isFavorite : !c.isFavorite
    );

    if (filterSelectedContacts.length === filterContacts.length)
      setSelectedContacts((v) =>
        [...v].filter((c) => !filterContacts.map((fc) => fc.id).includes(c.id))
      );
    else
      setSelectedContacts((v) =>
        [...v]
          .filter((c) => !filterContacts.map((fc) => fc.id).includes(c.id))
          .concat(filterContacts)
      );
  };

  {
    /** =================================== EFFECTS =================================== */
  }

  // populate contacts
  useEffect(() => {
    if (!isClient) return;
    handleGetContact(queryVariables.offset, queryVariables.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, queryVariables]);

  // pagination
  useEffect(() => {
    if (isBottom)
      setQueryVariables((v) => {
        return {
          offset: v.offset + v.limit,
          limit: v.limit,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottom]);

  return (
    <Contact.Provider
      value={{
        loadingFetch,
        loadingSearch,
        loadingInsert,
        list,
        favList,
        searchResult,
        selectedContact,
        selectedContacts,
        selectedFavOnly,
        selectedRegOnly,
        mode,
        handleInsertContact,
        handleUpdateContact,
        handleDeleteContact,
        handleBulkDeleteContact,
        handleSearch,
        toggleFavorite,
        bulkToggleFavorites,
        selectContact,
        selectContacts,
        selectAllContacts,
        setMode,
      }}
    >
      {children}
    </Contact.Provider>
  );
}
