import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

import { LINKS_PER_PAGE } from "../utils/const";
import { CREATE_LINK_MUTATION } from "../graphql/mutations";
import { CREATE_LINK_ERROR_FIELDS } from "../utils/const";
import { handleError } from "../utils/errorHelper";
import { FEED_QUERY } from "../graphql/queries";

const CreateLink = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    description: "",
    url: "",
    errors: {
      url: "",
      description: "",
    },
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formData.description,
      url: formData.url,
    },
    update: (cache, { data: { post } }) => {
      const take = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: "desc" };

      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links],
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
    onCompleted: () => history.push("/"),
    onError: (err) => {
      const errors = handleError(err.message, CREATE_LINK_ERROR_FIELDS);
      setFormData({ ...formData, errors: errors });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errors = validate(name, value);
    setFormData({ ...formData, [name]: value, errors: errors });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = formData.errors;
    for (const [k, v] of Object.entries(formData)) {
      let err = validate(k, v);
      errors = err;
    }
    setFormData({ ...formData, errors: errors });
    if (formIsValid(formData.errors)) {
      createLink();
    }
  };

  const formIsValid = (errors) => {
    console.log(errors);
    let valid = true;
    Object.values(errors).forEach((err) => err.length > 0 && (valid = false));
    return valid;
  };

  const validate = (name, value) => {
    let errors = formData.errors;
    switch (name) {
      case "url":
        errors.url = value.length === 0 ? "Please provide a URL" : "";
        break;
      case "description":
        errors.description =
          value.length === 0 ? "Please provide a description" : "";
        break;
      default:
        break;
    }
    return errors;
  };

  return (
    <Grid id="form-container" textAlign="center" verticalAlign="middle">
      <Grid.Column width={8}>
        <Form
          size="large"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Header>Post a new link</Header>
          <Segment raised padded>
            <Form.Field>
              <Form.Input
                name="url"
                className=""
                type="text"
                placeholder="Enter the URL of the link"
                value={formData.url}
                onChange={handleChange}
                error={formData.errors.url ? formData.errors.url : undefined}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="description"
                className=""
                type="text"
                placeholder="Enter a brief description of the link"
                value={formData.description}
                onChange={handleChange}
                error={
                  formData.errors.description
                    ? formData.errors.description
                    : undefined
                }
              />
            </Form.Field>
            <Button
              fluid
              size="large"
              color="teal"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default CreateLink;
