import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Container, Segment, List } from "semantic-ui-react";

import Link from "./Link";

const LINKS_QUERY = gql`
  {
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

const LinkList = (props) => {
  const { data, loading, error } = useQuery(LINKS_QUERY);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container id="link-list" text>
      <List ordered relaxed>
        {data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </List>
    </Container>
  );
};

export default LinkList;
