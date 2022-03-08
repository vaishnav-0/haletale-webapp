import { gql } from "@apollo/client";

export default {
    DELETE_IMAGE: gql`mutation DELETE_KEY($key: String) {
        delete_property_images(where: {key: {_eq: $key}}) {
          returning {
            key
          }
        }
      }
      `,

}
