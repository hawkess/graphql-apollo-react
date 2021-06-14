import React from "react";
import { List } from "semantic-ui-react";
import { AUTH_TOKEN, LINKS_PER_PAGE } from "../utils/const";
import { timeDifferenceForDate } from "../utils/timeDifference";

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: "desc" };

  return (
    <List.Item>
      {authToken && (
        <List.Icon
          name="heart"
          verticalAlign="middle"
          size="small"
          style={{ cursor: "pointer" }}
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
