import React from "react";
import { useQuery } from "@apollo/client";
import { Container, List } from "semantic-ui-react";

import { FEED_QUERY } from "../graphql/queries";
import Link from "./Link";

const LinkList = (props) => {
  const { data, loading, error } = useQuery(FEED_QUERY);
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
