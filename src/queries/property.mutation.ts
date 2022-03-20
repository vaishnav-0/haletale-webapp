import { gql } from '@apollo/client'


export default {
  ADD_PROPERTY_ADDRESS: gql`mutation MyMutation($property_id: uuid, $administrative_area_level_1: String, $administrative_area_level_2: String, $country: String, $full_address: String, $locality: String,$sublocality:String, $route: String, $street_number: String, $postal_code: String) {
    insert_property_address(objects: {property_id: $property_id, address: {data: {administrative_area_level_1: $administrative_area_level_1, administrative_area_level_2: $administrative_area_level_2, country: $country, full_address: $full_address, locality: $locality, route: $route, street_number: $street_number, postal_code: $postal_code,sublocality:$sublocality}}}) {
   affected_rows 
    }
  }`,

  ADD_PROPERTY: gql`mutation ADD_PROPERTY($coordinates: geography, $description: String, $name: String, $sub_type: Int, $type: Int) {
    insert_property_owner(objects: {property: {data: {coordinates: $coordinates, description: $description, name: $name, sub_type: $sub_type, type: $type}}}) {
      returning {
        property_id
      }
    }
  }`,

  ADD_PROPERTY_DETAILS: gql`mutation ADD_PROPERY_DETAILS($description: String, $features: jsonb, $max_occupants: Int, $lease_term : Int, $rent_amount: float8, $restrictions: jsonb, $rooms: jsonb, $id: uuid) {
    insert_property_details_one(object: {description: $description, features: $features, max_occupants: $max_occupants, ,lease_term: $lease_term ,rent_amount: $rent_amount, restrictions: $restrictions, rooms: $rooms, id: $id}) {
      id
    }
  }
  `,

  ADD_PROPERTY_IMAGES: gql`mutation ADD_IMAGE($object: [property_images_insert_input!]!) {  
      insert_property_images(objects:$object) {
        returning {
          id
        }
      }
    }`,
  UPDATE_PROPERTY: gql`mutation UPDATE_PROPERTY($id: uuid, $vars: property_set_input = {}, $details: property_details_set_input) {
    update_property(where: {id: {_eq: $id}}, _set: $vars) {
      affected_rows
    }
    update_property_details(where: {id: {_eq: $id}},  _set: $details){
      affected_rows
    }
  }`,
  DELETE_PROPERTY: gql`mutation DELETE_PROPERTY($pId: uuid, $aId: uuid) {
  delete_property(where: {id: {_eq: $pId}}) {
    affected_rows
  }
  delete_address(where: {id: {_eq: $pId}}) {
    affected_rows
  }
}
  `,
  UPDATE_IS_LISTED: gql`mutation UPDATE_IS_LISTED($id: uuid, $is_listed:Boolean) {
  update_property(where: {id: {_eq: $id}}, _set: {is_listed: $is_listed}) {
    affected_rows
  }
}`,


}