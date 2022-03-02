
import { gql } from '@apollo/client'

export default {
    GET_COUNTRIES: gql`query GET_COUNTRIES {
        countries {
          dialCode
          isoCode
          name
          id
        }
      }
      `
}