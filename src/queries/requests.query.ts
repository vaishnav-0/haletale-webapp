import { gql } from "@apollo/client";


export default {
  GET_ALL_REQUESTS: gql`query PROPERTY_REQUEST {
        property_request {
          intended_move_in_date
          lease_duration
          living_type
          other_tenents
          requested_at
        }
      }
      `,
  GET_REQUEST_BY_ID: gql`query PROPERTY_REQUEST($id:uuid) {
  property_request(where: {property_id: {_eq: $id}}) {
    intended_move_in_date
    lease_duration
    living_type
    other_tenents
    requested_at
  }
}
`

}
