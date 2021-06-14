import { useMutation } from "@apollo/client";
import React from "react";
import { List } from "semantic-ui-react";

import { FEED_QUERY } from "../graphql/queries";
import { VOTE_MUTATION } from "../graphql/mutations";
import { AUTH_TOKEN, LINKS_PER_PAGE } from "../utils/const";
import { timeDifferenceForDate } from "../utils/timeDifference";

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: "desc" };

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return [...feedLink.votes, vote];
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
      });
    },
  });

  return (
    <List.Item>
      {authToken && (
        <List.Icon
          name="heart"
          verticalAlign="middle"
          size="small"
          style={{ cursor: "pointer" }}
          onClick={() => authToken && vote()}
        />
      )}
      <List.Content>
        <List.Header
          as="a"
          href={`https://${link.url}`}
          size="small"
          color="teal"
        >
          {link.description} ({link.url})
        </List.Header>
        {authToken && (
          <List.Description>
            {link.votes.length} votes | posted by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}{" "}
          </List.Description>
        )}
      </List.Content>
    </List.Item>
  );
};

export default Link;
