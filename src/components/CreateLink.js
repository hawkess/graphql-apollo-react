import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation, gql } from "@apollo/client";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    description: "",
    url: "",
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formData.description,
      url: formData.url,
    },
    onCompleted: () => history.push("/"),
  });

  return (
    <Grid id="form-container" textAlign="center" verticalAlign="middle">
      <Grid.Column width={8}>
        <Form
          size="large"
          onSubmit={(e) => {
            e.preventDefault();
            createLink();
          }}
        >
          <Header>Post a new link</Header>
          <Segment raised padded>
            <Form.Field>
              <input
                className=""
                type="text"
                placeholder="Enter the URL of the link"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </Form.Field>
            <Form.Field>
              <input
                className=""
                type="text"
                placeholder="Enter a brief description of the link"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Field>
            <Button fluid size="large" color="teal" type="submit">
              Submit
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default CreateLink;
