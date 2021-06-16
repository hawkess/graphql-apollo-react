import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import gql from "graphql-tag";
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
  //const { data, loading, error } = useQuery(FEED_QUERY);
  const [filter, setFilter] = useState("");
  const [executeSearch, { data, loading, error }] =
    useLazyQuery(FEED_SEARCH_QUERY);

  useEffect(() => {
    console.log(filter);
    executeSearch({
      variables: {
        filter: filter,
      },
    });
  }, [executeSearch, filter]);

  return (
    <Container id="link-list" text>
      <Segment>
        <Search setFilter={setFilter} />
        {loading && <Loader active content="Loading" />}
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
