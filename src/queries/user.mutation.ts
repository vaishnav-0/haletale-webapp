import { gql } from '@apollo/client'




export default {
  UPDATE_USER_ROLE: gql`mutation UPDATE_USER_ROLE($role_id:Int, $id:uuid) {
        update_user_role(where: {user_id: {_eq: $id}}, _set: {role_id: $role_id}) {
          affected_rows
        }
    }`,



  UPDATE_PHONE_COUNTRY:  gql`mutation UPDATE_PHONE_COUNTRY($phone: String, $id: uuid, $nationality: uuid) {
    update_user(_set: {phone: $phone}, where: {id: {_eq: $id}}) {
      affected_rows
    }
    update_user_detail( _set: {nationality: $nationality},where: {id: {_eq: $id}}){
      affected_rows
    }
  }`,
}



