import { gql } from "@apollo/client";


export default {
  SEND_REQUEST: gql`mutation SEND_PROPERTY_REQUEST($lease_duration: Int, $other_tenants: jsonb, $intended_move_in_date: date,$reachout_time:String,$property_id:uuid) {
        insert_property_request(objects: {lease_duration: $lease_duration, other_tenents: $other_tenants, intended_move_in_date: $intended_move_in_date,reachout_time:$reachout_time,property_id:$property_id}) {
          affected_rows
        }
      }
      `,

  APPROVE_REQUEST : gql`mutation REQUEST_APPROVAL_STATUS($isApproved: Boolean, $id: uuid) {
    update_property_request(where: {id: {_eq: $id}}, _set: {isApproved: $isApproved}){
      affected_rows
    }
  }
  `,
  

}
