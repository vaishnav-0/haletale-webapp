import { gql } from '@apollo/client'
import { DeepPartial } from '../types/utilTypes'
interface IPropertyQuerty {
  id: string
  name: string
  description: string
  type: string
  sub_type: string
  coordinates: {
    coordinates: [number, number]
  }
  property_address: {
    address: {
      full_address: string
      locality: string
      country: string
      id: string
      postal_code: string
      administrative_area_level_1: string
      administrative_area_level_2: string
      route: string
      street_number: string
    }
  }
  property_detail: {
    max_occupants: string
    features: string[]
    description: string
    restrictions: string[]
    rent_amount: number
    rooms: {
      bedroom: number,
      bathroom: number,
      parking: number
    }
  }
  property_images: {
    key: string,
    s3Url: {
      url: string
    }
  }[]
}
export interface IPropertyDetails extends DeepPartial<IPropertyQuerty> { }

export default {
  GET_ADDRESS_BY_ID: gql`query GET_ADDRESS_BY_ID {
  address(where: { id: { _eq: "$id" } }) {
    addressline
    building_number
    city
    country
    landmarks
    province
    zipcode
  }
} `,

  GET_ALL_PROPERTY_TYPE_SUBTYPE: gql`query GET_PROPERTY_TYPE_LIST {
        property_type{
    name
  }
         property_subtype{
    name
  }
} `,

  GET_PROPERTY_BY_ID: gql`query GET_PROPERTY_BY_ID($id: uuid) {
  property(where: { id: { _eq: $id } }) {
    id
    name
    description
    type
    sub_type
    coordinates
      property_address {
        address {
        full_address
          ${""//locality
    //country
    //id
    //postal_code
    //administrative_area_level_1
    //administrative_area_level_2
    //route
    //street_number
    }
      }
    }
      property_detail {
      max_occupants
      features
      description
      restrictions
      rent_amount
      rooms
    }
      property_images {
        key
      s3Url{
        url
      }
    }
  }
} `,

  PROPERTY_ATTRIBUTES: gql`query PROPERTY_ATTRIBUTES {
    property_room_list {
    name
    comment
  }
    property_restrictions_list {
    name
    comment
  }
    property_features_list {
    name
    comment
  }
}
`,
  GET_PROPERTY_BY_DISTANCE: gql`query GET_PROPERTY_BY_DISTANCE($cur_coords: geography, $distance: Int, $offset: Int, $limit: Int) {
  show_nearby_properties(where:{property_detail: {}},args: { cur_coords: $cur_coords, distance: $distance }, offset: $offset, limit: $limit) {
      property_images {
      s3Url{
        url
      }
    }
    name
    sub_type
    type
      property_detail {
      rooms
      rent_amount
      restrictions
    }
  }
}
 `,
  GET_RECENT_PROPERTIES: gql`query GET_RECENT_PROPERTIES {
  property(where:{property_detail: {}},order_by: { created_at: desc }, limit: 10) {
    id
    name
    description
    type
    sub_type
    coordinates
      property_address {
        address {
        full_address
          ${""//locality
    //country
    //id
    //postal_code
    //administrative_area_level_1
    //administrative_area_level_2
    //route
    //street_number
    }
        }
      }
      property_detail {
      max_occupants
      features
      description
      restrictions
      rent_amount
      rooms
    }
      property_images {
      s3Url{
        url
      }
    }
  }
}`
}






