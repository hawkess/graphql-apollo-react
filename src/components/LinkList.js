import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Container, Segment } from "semantic-ui-react";

import Link from "./Link";

const LINKS_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

const LinkList = (props) => {
  const { data, loading, error } = useQuery(LINKS_QUERY);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container id="link-list">
      <Segment.Group padded>
        {data.feed.links.map((link) => (
          <Link id={link.id} link={link} />
        ))}
      </Segment.Group>
    </Container>
  );
};

export default LinkList;
