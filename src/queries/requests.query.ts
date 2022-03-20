import { gql } from "@apollo/client";

export interface IRequestData {
  property_request: {
    intended_move_in_date: string,
    lease_duration: number,
    reachout_time?: string
    other_tenents?:
    {
      name?: string
      email?: string
    }[]
    ,
    property_id: string,
    user: {
      email: string,
      phone: string,
      name: string
    }
  }[]
}
export interface IRequestCount {
  property_request: {
    property: {
      property_requests_aggregate: {
        aggregate: {
          count: number
        }
      }
    },
    property_id: string
  }[],
  property_request_aggregate: {
    aggregate: {
      count: number
    }
  }
}
export default {
  GET_ALL_REQUEST_COUNT: gql`query GET_ALL_REQUEST_COUNT {
  property_request(distinct_on: property_id) {
    property {
      property_requests_aggregate {
        aggregate {
          count
        }
      }
    },
    property_id
  }
  property_request_aggregate {
    aggregate {
      count
    }
  }
}
  `,
  GET_REQUEST_COUNT: gql`query GET_ALL_REQUEST_COUNT($id:uuid) {
  property_request_aggregate(where: {property_id: {_eq: $id}}) {
    aggregate {
      count
    }
  }
}
  `,
  GET_ALL_REQUESTS: gql`query PROPERTY_REQUEST {
        property_request {
        id
        intended_move_in_date
        lease_duration
        other_tenents
        property_id
        user {
          email
          phone
          name
        }
        }
      }
      `, ADMIN_GET_ALL_REQUESTS: gql`query ADMIN_GET_ALL_REQUESTS {
        property_request {
        id
        intended_move_in_date
        lease_duration
        other_tenents
        property_id
        reachout_time
        isApproved
        user {
          email
          phone
          name
        }
        }
      }
      `,
  GET_REQUEST_BY_ID: gql`query PROPERTY_REQUEST($id:uuid) {
  property_request(where: {property_id: {_eq: $id}}) {
    intended_move_in_date
    lease_duration
    living_type
    other_tenents
    requested_at
    user {
          email
          phone
          name
        }
  }
}
`,
  GET_REQUESTED_PROPERTIES: gql`query PROPERTY_REQUEST {
        property_request {
        intended_move_in_date
        lease_duration
        other_tenents
        property_id
        }
      }`,

}
