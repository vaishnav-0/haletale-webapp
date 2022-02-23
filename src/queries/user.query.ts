import { gql } from '@apollo/client'

export default {
    GET_USER_DETAILS: gql`query GET_USER_DETAILS($id:uuid) {
    user(where: {id: {_eq: $id}}) {
      name
      phone
      email
    }
  }`
}