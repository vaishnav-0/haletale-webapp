import { gql } from '@apollo/client'


export default{
    
    GET_ADDRESS_BY_ID :   gql`query GET_ADDRESS_BY_ID {
        address(where: {id: {_eq: "$id"}}) {
          addressline
          building_number
          city
          country
          landmarks
          province
          zipcode
        }
      }`      
    

}

