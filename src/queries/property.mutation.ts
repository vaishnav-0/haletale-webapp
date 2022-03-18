import { gql } from '@apollo/client'


export default {
  ADD_PROPERTY_ADDRESS: gql`mutation MyMutation($property_id: uuid, $administrative_area_level_1: String, $administrative_area_level_2: String, $country: String, $full_address: String, $locality: String, $route: String, $street_number: String, $postal_code: String) {
    insert_property_address(objects: {property_id: $property_id, address: {data: {administrative_area_level_1: $administrative_area_level_1, administrative_area_level_2: $administrative_area_level_2, country: $country, full_address: $full_address, locality: $locality, route: $route, street_number: $street_number, postal_code: $postal_code}}}) {
   affected_rows 
    }
  }`,

  ADD_PROPERTY: gql`mutation ADD_PROPERTY($coordinates: geography, $description: String, $name: String, $sub_type: uuid, $type: uuid) {
    insert_property_owner(objects: {property: {data: {coordinates: $coordinates, description: $description, name: $name, sub_type: $sub_type, type: $type}}}) {
      returning {
        property_id
      }
    }
  }`,

  ADD_PROPERTY_DETAILS: gql`mutation ADD_PROPERY_DETAILS($description: String, $features: jsonb, $max_occupants: Int, $rent_amount: float8, $restrictions: jsonb, $rooms: jsonb, $id: uuid) {
    insert_property_details_one(object: {description: $description, features: $features, max_occupants: $max_occupants, rent_amount: $rent_amount, restrictions: $restrictions, rooms: $rooms, id: $id}) {
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
  UPDATE_PROPERTY : gql`mutation UPDATE_PROPERTY($id: uuid, $vars: property_set_input = {}, $details: property_details_set_input) {
    update_property(where: {id: {_eq: $id}}, _set: $vars) {
      affected_rows
    }
    update_property_details(where: {id: {_eq: $id}},  _set: $details){
      affected_rows
    }
  }`,

  // update example
  // {
  //   "id": "78b0a75b-be01-42d2-b6d4-c04b10fd2b2b",
  //   "vars": {
  //     "coordinates": {
  //       "type":"Point",
  //       "coordinates": [
  //           76.431884765625,
  //           10.228437266155943
  //         ]
  //     },
  //     "name": "TestPROPP",
  //     "sub_type": "Mainlevel",
  //     "type": "Condos"
  //   },
  //   "details": {
  //     "rooms": {
  //       "bedroom" : 10
  //     }
  //   }
  // }
}