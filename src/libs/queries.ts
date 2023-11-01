import { gql } from "@apollo/client";

export const PHONE = `{
    id
    contact_id
    number
  }`;

export const CONTACT = `{
    id
    first_name
    last_name
    phones(offset: 0, order_by: { id: asc }) ${PHONE}
  }`;

export const GET_CONTACT = gql`
    query GetContact($offset: Int!, $limit: Int!) {
      contact(
        offset: $offset
        limit: $limit
        order_by: { first_name: asc, id: asc }
      ) ${CONTACT}
    }
  `;

export const SEARCH_CONTACT = gql`
    query SearchContact($search: String) {
      contact(
        where: {
          _or: [
            { first_name: { _ilike: $search } }
            { first_name: { _iregex: $search } }
            { last_name: { _ilike: $search } }
            { last_name: { _iregex: $search } }
          ]
        }
        order_by: { first_name: asc, id: asc }
      ) ${CONTACT}
    }
  `;

export const SEARCH_CONTACT_BY_NAME = gql`
    query SearchContactByName($first_name: String!, $last_name: String) {
      contact(
        where: {
          first_name: { _eq: $first_name }
          last_name: { _eq: $last_name }
        }
        order_by: { first_name: asc, id: asc }
      ) ${CONTACT}
    }
  `;
