import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { List } from "semantic-ui-react";
import { DELETE_VOTE_MUTATION, VOTE_MUTATION } from "../graphql/mutations";
import { AUTH_TOKEN, USER_ID } from "../utils/const";
import { timeDifferenceForDate } from "../utils/timeDifference";

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const userId = authToken ? localStorage.getItem(USER_ID) : undefined;
  const [voted, setVoted] = useState(
    link.votes.filter((vote) => vote.user.id === userId).length > 0
  );

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update(cache, { data: { vote } }) {
      cache.modify({
        id: cache.identify(link),
        fields: {
          votes(existingVotes, { readField }) {
            const newVote = cache.writeFragment({
              data: vote,
              fragment: gql`
                fragment NewVote on Vote {
                  id
                  user
                  link
                }
              `,
            });
            if (existingVotes.some((ref) => readField("id", ref) === vote.id)) {
              return existingVotes;
            }

            return [...existingVotes, newVote];
          },
        },
      });
    },
    onCompleted: () => {
      setVoted(true);
    },
  });

  const [deleteVote] = useMutation(DELETE_VOTE_MUTATION, {
    variables: {
      linkId: link.id,
      userId: userId,
    },
    update(cache, { data: { deleteVote } }) {
      cache.modify({
        id: cache.identify(link),
        fields: {
          votes(existingVotes, { readField }) {
            return existingVotes.filter(
              (voteRef) => deleteVote.id !== readField("id", voteRef)
            );
          },
        },
      });
    },
    onCompleted: () => {
      setVoted(false);
    },
  });

  return (
    <List.Item>
      <List.Icon
        name="heart"
        verticalAlign="middle"
        size="small"
        style={authToken ? { cursor: "pointer" } : {}}
        disabled={!authToken}
        onClick={() => {
          if (authToken) {
            voted && deleteVote();
            !voted && vote();
          }
        }}
        color={
          link.votes.filter((vote) => vote.user.id === userId).length > 0
            ? "red"
            : "grey"
        }
      />
      <List.Content>
        <List.Header
          as="a"
          href={`https://${link.url}`}
          size="small"
          color="teal"
        >
          {link.description} ({link.url})
        </List.Header>
        <List.Description>
          {link.votes.length} votes | posted by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}{" "}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

export default Link;
