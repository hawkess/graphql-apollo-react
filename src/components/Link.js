import React from "react";
import { Segment, Header } from "semantic-ui-react";

const Link = (props) => {
  const { link, id } = props;
  return (
    <Segment key={id} size="mini">
      <Header as="a" href={`https://${link.url}`} size="small" color="teal">
        {link.url}
        <Header.Subheader>{link.description}</Header.Subheader>
      </Header>
    </Segment>
  );
};

export default Link;
