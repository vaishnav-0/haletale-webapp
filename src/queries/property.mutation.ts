import { gql } from '@apollo/client'


export default {
  ADD_PROPERTY_ADDRESS: gql`mutation ADD_PROPERTY_ADDRESS($property_id: uuid = "", $addressline: String = "", $building_number: String = "", $city: String = "", $country: String = "", $landmarks: String = "", $province: String = "", $zipcode: String = "") {
        insert_property_address_one(object: {property_id: $property_id, address: {data: {addressline: $addressline, building_number: $building_number, city: $city, country: $country, landmarks: $landmarks, province: $province, zipcode: $zipcode}}}){
          address_id
        }
    }`,

  ADD_PROPERTY: gql`mutation ADD_PROPERTY($coordinates: geography, $description: String, $name: String, $sub_type: property_subtype_enum, $type: property_type_enum) {
      insert_property_one(object: {coordinates: $coordinates, description: $description, name: $name, sub_type: $sub_type, type: $type}) {
        id
      }
  }`,

  ADD_PROPERTY_DETAILS: gql`mutation ADD_PROPERTY_DETAILS($description: String = "", $features: json = "", $max_occupants: Int = 10, $restrictions: json = "", $id: uuid = "") {
        insert_property_details_one(object: {description: $description, features: $features, max_occupants: $max_occupants, restrictions: $restrictions, id: $id}) {
          id
        }
    }`,
}