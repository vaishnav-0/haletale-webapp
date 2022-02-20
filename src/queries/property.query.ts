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

  GET_ALL_PROPERTY_TYPE_SUBTYPE: gql`query GET_PROPERTY_TYPE_LIST {
        property_type{
          name
         }
         property_subtype{
          name
        }
      }`,

  GET_PROPERTY_BY_ID: gql`query GET_PROPERTY_BY_ID($id: uuid) {
    property(where: {id: {_eq: $id}}) {
      id
      name
      description
      property_address {
        address {
          addressline
          building_number
          city
          country
          id
          landmarks
        }
      }
      property_detail {
        max_occupants
        features
        description
        restrictions
      }
      property_images {
        key
      }
    }
  }`

}




