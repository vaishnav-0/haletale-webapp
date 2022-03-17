import { gql } from '@apollo/client'
import { IPropertyDetails, propertyFragment } from './property.query'
export interface IFavoriteData {
  user_favourites: {
    created_at: string,
    property_id: string,
    property: IPropertyDetails
  }[],
}
export interface IFavoriteAggrData {
  user_favourites_aggregate: {
    aggregate: {
      count: number
    }
  }
}
export interface IGetUserFav {
  user_favourites: {
    id: string
  }[]
}
export default {
  GET_USER_DETAILS: gql`query GET_USER_DETAILS($id:uuid) {
    user(where: {id: {_eq: $id}}) {

      id
      name
      phone
      email
    }
  }`,

  GET_PHONE_COUNTRY: gql`query GET_PHONE_COUNTRY ($id:uuid){
    user(where: {id: {_eq: $id}}) {
      phone
      user_detail {
        nationality
      }
    }
  }`,

  GET_USER_FAVS: gql`query USER_FAVOURITES($offset: Int, $limit: Int) {
    user_favourites(offset: $offset, limit: $limit) {
      property_id
      created_at
      property{
        ...propertyFragment
      }
    }
  }
  ${propertyFragment}
  `, GET_USER_FAVS_AGGREGATE: gql`query USER_FAVOURITES_AGGREGATE($offset: Int, $limit: Int) {
    user_favourites_aggregate {
      aggregate {
        count
      }
    }
  },
  `,

  CHECK_USER_FAV: gql`query CHECK_FAV($property_id: uuid) {
    user_favourites(where: {property_id: {_eq: $property_id}}){
      id
    }
  }
  `,
}