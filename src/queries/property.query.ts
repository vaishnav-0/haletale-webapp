import { gql } from '@apollo/client'
import { DeepPartial } from '../types/utilTypes'
interface IPropertyQueryOptional {

  description: string
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
export interface IPropertyDetails extends DeepPartial<IPropertyQueryOptional> {
  id: string
  name: string
  type: string
  sub_type: string
  is_approved: boolean
  coordinates: {
    coordinates: [number, number]
  }
}
export interface IPropertyAttribute {
  property_features_list: { name: string, comment: string }[],
  property_restrictions_list: { name: string, comment: string }[],
  property_room_list: { name: string, comment: string }[]
}
export const propertyFragment = gql`
  fragment propertyFragment on property {
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
      id
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
  }`

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
    ...propertyFragment
  } 
}
  ${propertyFragment}
`,

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
    ...propertyFragment
    } 

    show_nearby_properties_aggregate(where:{property_detail: {}},args: { cur_coords: $cur_coords, distance: $distance }) {
      aggregate{
        totalCount : count
      }
    }
  }
${propertyFragment}
 `,
  GET_RECENT_PROPERTIES: gql`query GET_RECENT_PROPERTIES {
  property(where:{property_detail: {}},order_by: { created_at: desc }, limit: 10) {
    ...propertyFragment
  }
}
  ${propertyFragment}
`,
  GET_PROPERTY_BY_OWNER: gql`query GET_PROPERTY_OWNER{
  property_owner {
    property {
    ...propertyFragment
  }
  }
}
  ${propertyFragment}
`,
  GET_OWNER_PROPERTIES: gql`query GET_OWNER_PROPERTIES {
  property_owner {
    property {
      id
      name
      property_address {
        address {
          full_address
        }
      }
      property_detail {
        id
        features
        rent_amount
        rooms
      }
      type
      sub_type
      is_approved
    }
  }
}
`,

  SEARCH_PROPERTY: gql`query SEARCH_PROPERTY($country:String,$locality: String, $postal_code: String, $route: String, $street_number:String, $administrative_area_level_2:String, $administrative_area_level_1:String,$order_by:property_order_by={created_at:asc},$offset:Int,$limit:Int,$room: jsonb = {},$features: jsonb = [], $rent_gt: float8 = 0, $rent_lt: float8 = Infinity) {
  search_property(where:{property_detail: {rooms: {_contains: $room}, rent_amount: {_gte: $rent_gt, _lte: $rent_lt}, features: {_contains: $features}}}, args: {_country: $country, _locality: $locality, _postal_code: $postal_code, _route: $route, _street_number: $street_number, _administrative_area_level_2:$administrative_area_level_2 , _administrative_area_level_1: $administrative_area_level_1}, order_by:[$order_by],offset: $offset, limit: $limit) {
    ...propertyFragment
  }

}
  ${propertyFragment}
`,
  SEARCH_PROPERTY_AGGREGATE: gql`query SEARCH_PROPERTY_AGGREGATE($country:String,$locality: String, $postal_code: String, $route: String, $street_number:String, $administrative_area_level_2:String, $administrative_area_level_1:String,$order_by:property_order_by={created_at:asc},$offset:Int,$limit:Int,$room: jsonb = {},$features: jsonb = [], $rent_gt: float8 = 0, $rent_lt: float8 = Infinity){
    search_property_aggregate(where:{property_detail:{}}, args: {_country: $country, _locality: $locality, _postal_code: $postal_code, _route: $route, _street_number: $street_number, _administrative_area_level_2:$administrative_area_level_2 , _administrative_area_level_1: $administrative_area_level_1}){
      aggregate{
        totalCount : count
      }
    }
  }
  `,
  GET_ALL_PROPERTIES: gql`query GET_ALL_PROPERTIES($offset:Int,$limit:Int ) {
  property(where:{property_detail:{}},offset: $offset, limit: $limit) {
    ...propertyFragment
  }

}
  ${propertyFragment}
`,
  GET_ALL_PROPERTY_AGGREGATE: gql`query GET_ALL_PROPERTIES_AGGREGATE($offset:Int,$limit:Int ){
    property_aggregate(where:{property_detail:{}},offset: $offset, limit: $limit) {
      aggregate{
        totalCount : count
      }
    }
  }
  `
  ,
}






