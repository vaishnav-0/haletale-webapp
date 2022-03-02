import { gql } from "@apollo/client";


export default{
    GET_ALL_REQUESTS : gql`query PROPERTY_REQUEST {
        property_request {
          intended_move_in_date
          lease_duration
          living_type
          other_tenents
          requested_at
          tenant_id
          tenant_status
        }
      }
      `,

}
