import type { Contact, ContactFormInput, Phone } from "@/context/Contact";

export const isDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const validateCharacters = (str: string) => {
  const regex = /[^a-zA-Z0-9\s]/;
  return !regex.test(str);
};

export const scrollToTop = () => {
  const layout = document.getElementById("main");
  if (layout) layout.scrollTo({ top: 0 });
};

export function randomNumbers(length: number) {
  const charset = "0123456789";

  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/** =================================== CONTACT HELPERS =================================== */

export default function dummyData(count: number): ContactFormInput[] {
  return Array(count)
    .fill({})
    .map((_, i) => ({
      first_name: "demo" + i,
      last_name: "",
      phones: Array(randomIntFromInterval(1, 10))
        .fill({})
        .map((_, j) => ({
          number: randomNumbers(randomIntFromInterval(8, 12)),
        })),
    }));
}

export const saveFavList = (list: Contact[]): void => {
  const savedFavList = list.filter((contact) => contact.isFavorite);
  localStorage.setItem("favList", JSON.stringify(savedFavList));
};

export const getFavList = (): Contact[] => {
  const savedFavListJSON = localStorage.getItem("favList");
  let list: Contact[] = [];
  if (!savedFavListJSON) localStorage.setItem("favList", "[]");
  else list = JSON.parse(savedFavListJSON);

  return list.sort((a, b) =>
    a.first_name.toLowerCase() < b.first_name.toLowerCase() ? -1 : 1
  );
};

export const findById = (
  list: Contact[],
  contactId: number
): Contact | undefined => list.find((c) => c.id === contactId);

export const sortyByFirstName = (list: Contact[]): Contact[] =>
  list.sort((a, b) =>
    a.first_name.toLowerCase() < b.first_name.toLowerCase() ? -1 : 1
  );

export const updateList = (
  list: Contact[],
  contactId: number,
  cb: (contact: Contact) => any
) =>
  list.map((contact) =>
    contact.id === contactId ? { ...contact, ...cb(contact) } : contact
  );

export const getFullName = (contact: Contact | ContactFormInput | undefined) =>
  [contact?.first_name, contact?.last_name].filter(Boolean).join(" ");

type UpdateContactPhonesParams = {
  contactId: number;
  contacts: Contact[];
  newNumbers: Phone[];
  updatedNumbers: Phone[];
  deletedNumbers: Phone[];
};

export const updateContactPhones = ({
  contactId,
  contacts,
  newNumbers,
  updatedNumbers,
  deletedNumbers,
}: UpdateContactPhonesParams) => {
  let updatedContactPhones = undefined as Contact | undefined;
  const updatedContacts = contacts.map((c) => {
    const matchedId = c.id === contactId;

    if (matchedId) {
      if (newNumbers.length) c = { ...c, phones: [...c.phones, ...newNumbers] };
      if (updatedNumbers.length)
        c = {
          ...c,
          phones: c.phones.map((p) => {
            let updatedNumber = updatedNumbers.find((up) => up.id === p.id);
            return updatedNumber?.id ? { ...p, ...updatedNumber } : p;
          }),
        };
      if (deletedNumbers.length)
        c = {
          ...c,
          phones: c.phones.filter(
            (p) => !Boolean(deletedNumbers.find((up) => up.id === p.id))
          ),
        };

      updatedContactPhones = c;
    }

    return c;
  });

  return { contact: updatedContactPhones, contacts: updatedContacts };
};

/** =================================== CONTACT BULK SELECTOR =================================== */

type BulkDeselectParams = {
  selectedContacts: Contact[];
  contacts: Contact[];
  contact: Contact;
  index: number;
  shiftHeld: boolean;
};

type BulkSelectParams = {
  selectedContacts: Contact[];
  contacts: Contact[];
  contact: Contact;
  shiftHeld: boolean;
};

export const handleBulkDeselect = ({
  selectedContacts,
  contacts,
  contact,
  index,
  shiftHeld,
}: BulkDeselectParams) => {
  selectedContacts = [
    ...selectedContacts.slice(0, index),
    ...selectedContacts.slice(index + 1),
  ];
  if (shiftHeld) {
    let currIndex = contacts.findIndex((c) => c.id === contact.id);
    for (let i = currIndex + 1; i <= contacts.length; i++) {
      if (!contacts[i]) break;
      let isSelected = findById(selectedContacts, contacts[i].id);

      if (isSelected)
        selectedContacts = selectedContacts.filter(
          (c) => c.id !== contacts[i].id
        );
      else break;
    }
  }

  return selectedContacts;
};

export const handleBulkSelect = ({
  selectedContacts,
  contacts,
  contact,
  shiftHeld,
}: BulkSelectParams) => {
  selectedContacts = [...selectedContacts, contact];
  if (shiftHeld) {
    let currIndex = contacts.findIndex((c) => c.id === contact.id);
    for (let i = currIndex - 1; i >= 0; i--) {
      if (!contacts[i]) break;
      let isSelected = findById(selectedContacts, contacts[i].id);
      if (!isSelected) selectedContacts = [...selectedContacts, contacts[i]];
      else break;
    }
  }

  return selectedContacts;
};
