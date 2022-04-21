import { gql } from '@apollo/client';

export interface IAddUserFav {
  insert_user_favourites_one: {
    id: string
  }
}
export default {
  UPDATE_USER_ROLE: gql`mutation UPDATE_USER_ROLE($role_id:Int, $id:uuid) {
        update_user_role(where: {user_id: {_eq: $id}}, _set: {role_id: $role_id}) {
          affected_rows
        }
    }`,

  UPDATE_PHONE_COUNTRY: gql`mutation UPDATE_PHONE_COUNTRY($phone: String, $id: uuid, $nationality: uuid) {
    update_user(_set: {phone: $phone}, where: {id: {_eq: $id}}) {
      affected_rows
    }
    update_user_detail( _set: {nationality: $nationality},where: {id: {_eq: $id}}){
      affected_rows
    }
  }`,

  ADD_USER_FAV: gql`mutation ADD_USER_FAV($property_id: uuid) {
    insert_user_favourites_one(object: {property_id: $property_id}) {
      id
    }
  }`,
  DELETE_FAV: gql`mutation DELETE_FAV($property_id: uuid) {
    delete_user_favourites(where: {property_id: {_eq: $property_id}}) {
      returning {
        id
      }
    }
  }
`,
  SET_USER_STATUS: gql`mutation DISABLE_USER($id: uuid, $isActive: Boolean) {
  update_user(where: {id: {_eq: $id}}, _set: {isActive: $isActive}){
    affected_rows
  }
}`,
  DELETE_USERS:gql`mutation DELETE_USERS($ids: [uuid!]) {
  delete_user(where: {id: {_in: $ids}}) {
    affected_rows
  }
}
`
}



