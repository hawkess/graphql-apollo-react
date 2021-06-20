import { gql } from "@apollo/client";

export const FEED_QUERY = gql`
  query getFeed {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export const FEED_SEARCH_QUERY = gql`
  query feedSearch(
    $filter: String
    $orderBy: LinkOrderByInput
    $skip: Int
    $take: Int
  ) {
    feed(filter: $filter, orderBy: $orderBy, skip: $skip, take: $take) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;
