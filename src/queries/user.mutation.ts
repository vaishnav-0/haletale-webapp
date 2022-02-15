import { gql } from '@apollo/client'




export default {
  UPDATE_USER_ROLE: gql`mutation UPDATE_USER_ROLE($role_id:Int, $id:uuid) {
        update_user_role(where: {user_id: {_eq: $id}}, _set: {role_id: $role_id}) {
          affected_rows
        }
    }`
}



