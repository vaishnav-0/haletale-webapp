import { gql } from "@apollo/client";


export default {
  SEND_REQUEST: gql`mutation SEND_PROPERTY_REQUEST($lease_duration: Int, $other_tenants: jsonb, $intended_move_in_date: date,$reachout_time:String,$property_id:uuid) {
        insert_property_request(objects: {lease_duration: $lease_duration, other_tenents: $other_tenants, intended_move_in_date: $intended_move_in_date,reachout_time:$reachout_time,property_id:$property_id}) {
          affected_rows
        }
      }
      `,

  APPROVE_REQUESTS : gql`mutation REQUEST_APPROVAL_STATUS($isApproved: Boolean, $ids: [uuid!]) {
    update_property_request(where: {id: {_in: $ids}}, _set: {isApproved: $isApproved}){
      affected_rows
    }
  }
  `,
  DELETE_REQUEST:gql`mutation DELETE_REQUEST($ids: [uuid!]) {
    delete_property_request(where: {id: {_in: $ids}}) {
      affected_rows
  }
}
  `,
  UPDATE_STATUS:gql`mutation UPDATE_STATUS($status: String = "", $id: uuid) {
  update_property_request(where: {id: {_eq: $id}}, _set: {status: $status}) {
    affected_rows
  }
}

  `
}
