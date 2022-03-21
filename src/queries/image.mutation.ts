import { gql } from "@apollo/client";

export default {
    DELETE_IMAGES: gql`mutation DELETE_KEYS($keys: [String!]) {
        delete_property_images(where: {key: {_in: $keys}}) {
          returning {
            key
          }
        }
      }
      `,

}
