import React from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Header,
  Icon,
  List,
  Loader,
  Segment,
} from "semantic-ui-react";

import { FEED_QUERY } from "../graphql/queries";
import Link from "./Link";
import Search from "./Search";

const LinkList = () => {
  const { data, loading, error } = useQuery(FEED_QUERY);

  return (
    <Container id="link-list" text>
      {loading && (
        <Segment placeholder>
          <Loader active content="Loading" />
        </Segment>
      )}
      {data && (
        <Segment>
          <Search />
          <List ordered relaxed>
            {data.feed.links.map((link, index) => (
              <Link key={link.id} link={link} index={index} />
            ))}
          </List>
        </Segment>
      )}
      {error && (
        <Segment placeholder>
          <Header icon>
            <Icon name="warning sign" />
            {`Error! ${error.message}`}
          </Header>
        </Segment>
      )}
    </Container>
  );
};

export default LinkList;
