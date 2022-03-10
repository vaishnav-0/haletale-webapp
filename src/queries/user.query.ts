import { gql } from '@apollo/client'

export default {
  GET_USER_DETAILS: gql`query GET_USER_DETAILS($id:uuid) {
    user(where: {id: {_eq: $id}}) {
      name
      phone
      email
    }
  }`,

  GET_PHONE_COUNTRY: gql`query GET_PHONE_COUNTRY ($id:uuid){
    user(where: {id: {_eq: $id}}) {
      phone
      user_detail {
        nationality
      }
    }
  }`,

  GET_USER_FAVS : gql`query USER_FAVOURITES {
    user_favourites {
      property_id
      created_at
    }
  }`,
  
  CHECK_USER_FAV : gql`query CHECK_FAV($property_id: uuid) {
    user_favourites(where: {property_id: {_eq: $property_id}}){
      id
    }
  }
  `,
}