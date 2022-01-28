import { gql } from '@apollo/client'


export default {

  GET_ADDRESS_BY_ID: gql`query GET_ADDRESS_BY_ID {
        address(where: {id: {_eq: "$id"}}) {
          addressline
          building_number
          city
          country
          landmarks
          province
          zipcode
        }
      }`,

  GET_ALL_PROPERTY_TYPE: `query GET_PROPERTY_TYPE_LIST {
        property_type{
          name,
          description
        }
      }`,

  GET_ALL_PROPERTY_SUBTYPE: `query GET_PROPERTY_SUBTYPE_LIST {
        property_subtype{
          name,
          description
        }
      }`,

}




