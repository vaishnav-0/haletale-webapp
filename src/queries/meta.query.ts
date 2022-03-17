
import { gql } from '@apollo/client'

export default {
  GET_COUNTRIES: gql`query GET_COUNTRIES {
        countries(order_by: {isoCode: asc}) {
          dialCode
          isoCode
          name
          id
        }
      }
      `,
}