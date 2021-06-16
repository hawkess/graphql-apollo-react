import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Header,
  Icon,
  List,
  Loader,
  Segment,
} from "semantic-ui-react";

import { FEED_SEARCH_QUERY } from "../graphql/queries";
import Link from "./Link";
import Search from "./Search";

const LinkList = () => {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState({ orderBy: "createdAt", sort: "asc" });
  const orderBy = { [sortBy.orderBy]: sortBy.sort };
  console.log(orderBy);
  const { data, loading, error } = useQuery(FEED_SEARCH_QUERY, {
    variables: { filter: filter, orderBy: orderBy },
  });

  return (
    <Container id="link-list" text>
      <Segment>
        <Search setFilter={setFilter} setSortBy={setSortBy} />
        {loading && (
          <Segment placeholder>
            <Loader active content="Loading" />
          </Segment>
        )}
        {data && (
          <List ordered relaxed>
            {data.feed.links.map((link, index) => (
              <Link key={link.id} link={link} index={index} />
            ))}
          </List>
        )}
        {error && (
          <Header icon>
            <Icon name="warning sign" />
            {`Error! ${error.message}`}
          </Header>
        )}
      </Segment>
    </Container>
  );
};

export default LinkList;
