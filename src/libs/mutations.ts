import { gql } from "@apollo/client";
import { CONTACT, PHONE } from "./queries";

export const INSERT_CONTACT = gql`
    mutation InsertContact($contact: contact_insert_input!) {
      insert_contact_one(object: $contact) ${CONTACT}
    }
  `;

export const INSERT_CONTACTS = gql`
    mutation InsertContacts($contacts: [contact_insert_input]!) {
      insert_contact(objects: $contacts) {
        returning ${CONTACT}
      }
    }
  `;

export const UPDATE_CONTACT = gql`
    mutation UpdateContact($contact: contact_set_input!, $contactId: Int!) {
      update_contact_by_pk(
        _set: $contact
        pk_columns: {
          id: $contactId
        }
      ) ${CONTACT}
    }
  `;

export const DELETE_CONTACT = gql`
    mutation DeleteContact($contactIds: [Int]!) {
      delete_contact(
        where: { id: { _in: $contactIds } }
      ) {
        returning ${CONTACT}
      }
    }
  `;

export const DELETE_CONTACT_BY_ID = gql`
    mutation DeleteContactByID($contactId: Int!) {
      delete_contact_by_pk(id: $contactId) ${CONTACT}
    }
  `;

export const INSERT_PHONE = gql`
    mutation InsertPhones($phones: [phone_insert_input]!) {
      insert_phone(
        objects: $phones
      ) {
        returning ${PHONE}
      }
    }
  `;

export const UPDATE_PHONE_BY_ID = gql`
    mutation UpdatePhoneByID($phone: phone_set_input!, $phoneId: Int!) {
      update_phone(
        _set: $phone
        where: { id: {_eq: $phoneId} }
      ) {
        returning ${PHONE}
      }
    }
  `;

  export const DELETE_PHONE = gql`
    mutation DeletePhoneByID($phoneIds: [Int]!) {
      delete_phone(
        where: { id: {_in: $phoneIds} }
      ) {
        returning ${PHONE}
      }
    }
  `;
