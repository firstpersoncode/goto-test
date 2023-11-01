import { Dispatch, SetStateAction } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import apolloClient from "@/libs/apolloClient";
import {
  GET_CONTACT,
  SEARCH_CONTACT,
  SEARCH_CONTACT_BY_NAME,
} from "@/libs/queries";
import {
  DELETE_CONTACT,
  DELETE_CONTACT_BY_ID,
  DELETE_PHONE,
  INSERT_CONTACT,
  INSERT_PHONE,
  UPDATE_CONTACT,
  UPDATE_PHONE_BY_ID,
} from "@/libs/mutations";
import { useDebounce } from "@/libs/hooks";
import {
  findById,
  getFavList,
  getFullName,
  saveFavList,
  updateContactPhones,
  validateCharacters,
} from "@/libs/utils";
import type { Contact, ContactFormInput, Mode, Phone } from ".";

type HookContactQueriesDispatcher = {
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  setSearchResult: Dispatch<SetStateAction<Contact[]>>;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
};

type HookContactQueriesParams = {
  dispatchers: HookContactQueriesDispatcher;
};

type HookContactMutationsContext = {
  selectedContact: Contact | undefined;
  selectedContacts: Contact[];
};

type HookContactMutationsDispatcher = {
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  setSearchResult: Dispatch<SetStateAction<Contact[]>>;
  setSelectedContact: Dispatch<SetStateAction<Contact | undefined>>;
  setSelectedContacts: Dispatch<SetStateAction<Contact[]>>;
  setMode: Dispatch<SetStateAction<Mode>>;
};

type HookContactMutationsParams = {
  context: HookContactMutationsContext;
  dispatchers: HookContactMutationsDispatcher;
};

export type PhoneInput = {
  id?: number;
  contact_id?: number;
  number: string;
};

export type ContactInput = {
  id?: number;
  first_name: string;
  last_name?: string;
};

export type InsertPhoneInput = {
  phones: {
    data: PhoneInput[];
  };
};

type InsertContactInput = ContactInput & InsertPhoneInput;

export const useContactQueries = ({
  dispatchers,
}: HookContactQueriesParams) => {
  const [getContact, { loading: loadingFetch }] = useLazyQuery<{
    contact: Contact[];
  }>(GET_CONTACT, {
    pollInterval: 0,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [searchContact, { loading: loadingSearch }] = useLazyQuery<{
    contact: Contact[];
  }>(SEARCH_CONTACT, {
    pollInterval: 0,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const handleSearch = useDebounce(async (search: string) => {
    if (!search) {
      dispatchers.setSearchResult([]);
      dispatchers.setIsSearching(false)
      return;
    }

    dispatchers.setIsSearching(true)

    const res = await searchContact({
      variables: { search },
    });

    const data = res.data?.contact;
    if (data?.length) {
      const savedFavList = getFavList();
      dispatchers.setSearchResult(
        data.map((contact) => {
          const savedContact = findById(savedFavList, contact.id);
          return savedContact
            ? { ...contact, isFavorite: savedContact.isFavorite }
            : contact;
        })
      );
    } else dispatchers.setSearchResult([])
  }, 500);

  const handleGetContact = async (offset: number, limit: number) => {
    const res = await getContact({
      variables: { offset, limit },
    });

    const data = res.data?.contact;
    if (data?.length) {
      const savedFavList = getFavList();
      dispatchers.setContacts((v) => [
        ...savedFavList,
        ...v.filter((contact) => !Boolean(findById(savedFavList, contact.id))),
        ...data.filter(
          (contact) => !Boolean(findById(savedFavList, contact.id))
        ),
      ]);
    }
  };

  return {
    loadingFetch,
    loadingSearch,
    handleSearch,
    handleGetContact,
  };
};

export const useContactMutations = ({
  context,
  dispatchers,
}: HookContactMutationsParams) => {
  const [insertContact, { loading: loadingInsert }] = useMutation<
    { insert_contact_one: Contact },
    { contact: InsertContactInput }
  >(INSERT_CONTACT);

  const [updateContact] = useMutation<
    { update_contact_by_pk: Contact },
    { contactId: number; contact: ContactInput }
  >(UPDATE_CONTACT);

  const [deleteContact] = useMutation<
    { delete_contact_by_pk: Contact },
    { contactId: number }
  >(DELETE_CONTACT_BY_ID);

  const [deleteContacts] = useMutation<
    { delete_contact: { returning: Contact[] } },
    { contactIds: number[] }
  >(DELETE_CONTACT);

  const [insertPhones] = useMutation<
    { insert_phone: { returning: Phone[] } },
    { phones: PhoneInput[] }
  >(INSERT_PHONE);

  const [updatePhone] = useMutation<
    { update_phone: { returning: Phone[] } },
    { phone: PhoneInput; phoneId: number }
  >(UPDATE_PHONE_BY_ID);

  const [deletePhones] = useMutation<
    { delete_phone: { returning: Phone[] } },
    { phoneIds: number[] }
  >(DELETE_PHONE);

  const handleInsertContact = async (contact: ContactFormInput) => {
    if (!contact.first_name) throw new Error("First name is required");
    if (!contact.phones[0]?.number)
      throw new Error("Primary number is required");
    if (!validateCharacters(getFullName(contact)))
      throw new Error("Name should not have special character(s)");

    const { data } = await apolloClient.query({
      query: SEARCH_CONTACT_BY_NAME,
      variables: {
        first_name: contact.first_name,
        last_name: contact.last_name,
      },
    });

    if (data?.contact.length)
      throw new Error(
        `Contact already exists with name ${getFullName(contact)}`
      );

    const res = await insertContact({
      variables: {
        contact: {
          ...contact,
          phones: { data: contact.phones as PhoneInput[] },
        },
      },
    });

    if (res.errors) throw new Error("Something went wrong");

    const newContact = res.data?.insert_contact_one;
    if (newContact) {
      dispatchers.setContacts((currContacts) => [...currContacts, newContact]);
      if (context.selectedContact) dispatchers.setSelectedContact(newContact);
      dispatchers.setMode("read");
    }
  };

  const handleUpdateContact = async (
    contactId: number,
    contact: ContactFormInput
  ) => {
    if (!contact.first_name) throw new Error("First name is required");
    if (!contact.phones[0]?.number)
      throw new Error("Primary number is required");
    if (!validateCharacters(getFullName(contact)))
      throw new Error("Name should not have special character(s)");

    const contactDetailUpdated =
      getFullName(context.selectedContact) !== getFullName(contact);

    let newNumbers = contact.phones.filter((p) => !p.id) as Phone[];
    let updatedNumbers = [] as Phone[];
    let deletedNumbers = [] as Phone[];
    if (context.selectedContact?.phones.length) {
      let selected = context.selectedContact;
      updatedNumbers = contact.phones.filter((p) => {
        const selectedPhone = selected.phones.find((cp) => cp.id === p.id);
        return Boolean(selectedPhone && p.number !== selectedPhone.number);
      }) as Phone[];

      deletedNumbers = selected.phones.filter(
        (c) => !Boolean(contact.phones.find((cp) => cp.id === c.id))
      );
    }

    const contactPhonesUpdated = Boolean(
      newNumbers.length || updatedNumbers.length || deletedNumbers.length
    );

    if (contactDetailUpdated) {
      const { data } = await apolloClient.query({
        query: SEARCH_CONTACT_BY_NAME,
        variables: {
          first_name: contact.first_name,
          last_name: contact.last_name,
        },
      });

      if (data?.contact.length)
        throw new Error(
          `Contact already exists with name ${getFullName(contact)}`
        );

      const contactInput = {
        first_name: contact.first_name,
        last_name: contact.last_name,
      };

      const res = await updateContact({
        variables: { contactId, contact: contactInput },
      });

      const updatedContact = res.data?.update_contact_by_pk;

      if (updatedContact) {
        dispatchers.setContacts((currContacts) => {
          let updatedContacts = currContacts.map((c) =>
            c.id === contactId ? { ...c, ...updatedContact } : c
          );
          saveFavList(updatedContacts);
          return updatedContacts;
        });

        dispatchers.setSearchResult((currContacts) => {
          let updatedContacts = currContacts.map((c) =>
            c.id === contactId ? { ...c, ...updatedContact } : c
          );
          return updatedContacts;
        });

        if (context.selectedContact)
          dispatchers.setSelectedContact(updatedContact);
      }
    }

    if (contactPhonesUpdated) {
      if (newNumbers.length) {
        const phoneInsRes = await insertPhones({
          variables: {
            phones: newNumbers.map((p) => ({ ...p, contact_id: contact.id })),
          },
        });

        const newPhoneData = phoneInsRes.data?.insert_phone.returning;
        if (newPhoneData?.length) newNumbers = newPhoneData;
      }

      if (updatedNumbers.length) {
        let _updatedNumbers = [] as Phone[];
        for (let phone of updatedNumbers) {
          const phoneUpsRes = await updatePhone({
            variables: { phone: { number: phone.number }, phoneId: phone.id },
          });

          const updatedPhoneData = phoneUpsRes.data?.update_phone.returning;
          if (updatedPhoneData?.length)
            _updatedNumbers = [..._updatedNumbers, ...updatedPhoneData];
        }

        updatedNumbers = _updatedNumbers;
      }

      if (deletedNumbers.length) {
        const phoneDelRes = await deletePhones({
          variables: { phoneIds: deletedNumbers.map((p) => p.id) },
        });
        const deletedPhoneData = phoneDelRes.data?.delete_phone.returning;
        if (deletedPhoneData?.length) deletedNumbers = deletedPhoneData;
      }

      dispatchers.setContacts((currContacts) => {
        const { contacts, contact } = updateContactPhones({
          contactId,
          contacts: currContacts,
          newNumbers,
          updatedNumbers,
          deletedNumbers,
        });

        if (context.selectedContact) dispatchers.setSelectedContact(contact);

        return contacts;
      });

      dispatchers.setSearchResult((currContacts) => {
        const { contacts } = updateContactPhones({
          contactId,
          contacts: currContacts,
          newNumbers,
          updatedNumbers,
          deletedNumbers,
        });

        return contacts;
      });
    }

    if (context.selectedContact) dispatchers.setMode("read");
  };

  const handleDeleteContact = async (contactId: number) => {
    const res = await deleteContact({ variables: { contactId } });

    if (res.errors) throw new Error("Something went wrong");

    dispatchers.setContacts((currContacts) =>
      [...currContacts].filter((c) => c.id !== contactId)
    );
    dispatchers.setSearchResult((currContacts) =>
      [...currContacts].filter((c) => c.id !== contactId)
    );

    let savedFavList = getFavList();
    if (savedFavList.length)
      saveFavList(savedFavList.filter((c) => c.id !== contactId));
  };

  const handleBulkDeleteContact = async () => {
    if (context.selectedContacts.length) {
      const res = await deleteContacts({
        variables: { contactIds: context.selectedContacts.map((c) => c.id) },
      });

      if (res.errors) throw new Error("Something went wrong");

      const deletedContacts = res.data?.delete_contact?.returning;

      if (deletedContacts?.length) {
        dispatchers.setContacts((currContacts) =>
          [...currContacts].filter(
            (c) => !Boolean(findById(deletedContacts, c.id))
          )
        );
        dispatchers.setSearchResult((currContacts) =>
          [...currContacts].filter(
            (c) => !Boolean(findById(deletedContacts, c.id))
          )
        );

        let savedFavList = getFavList();
        if (savedFavList.length)
          saveFavList(
            savedFavList.filter(
              (c) => !Boolean(findById(deletedContacts, c.id))
            )
          );
      }

      dispatchers.setSelectedContacts([]);
    }
  };

  return {
    loadingInsert,
    handleInsertContact,
    handleUpdateContact,
    handleDeleteContact,
    handleBulkDeleteContact,
  };
};
