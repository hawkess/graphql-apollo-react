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
import { useHistory } from "react-router";

import {
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION,
} from "../graphql/subscriptions";
import { FEED_SEARCH_QUERY } from "../graphql/queries";
import Link from "./Link";
import Search from "./Search";
import { LINKS_PER_PAGE } from "../utils/const";

const LinkList = () => {
  const history = useHistory();
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState({ orderBy: "createdAt", asc: false });
  const orderBy = { [sortBy.orderBy]: sortBy.asc === true ? "asc" : "desc" };
  const indexSplit = history.location.pathname.split("/");
  const page = parseInt(indexSplit[indexSplit.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;
  const { data, loading, error, subscribeToMore } = useQuery(
    FEED_SEARCH_QUERY,
    {
      variables: {
        filter: filter,
        orderBy: orderBy,
      },
    }
  );

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return (
        Object.assign({}, prev),
        {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        }
      );
    },
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
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
