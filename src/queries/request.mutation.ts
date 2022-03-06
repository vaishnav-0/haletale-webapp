import { gql } from "@apollo/client";


export default{
    SEND_REQUEST : gql`mutation SEND_PROPERTY_REQUEST($lease_duration: d, $other_tenents: jsonb, $intended_move_in_date: date) {
        insert_property_request(objects: {lease_duration: $lease_duration, other_tenents: $other_tenents, intended_move_in_date: $intended_move_in_date}) {
          affected_rows
        }
      }
      `,

}
