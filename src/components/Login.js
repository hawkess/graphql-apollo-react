import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/mutations";
import { AUTH_TOKEN, LOGIN_ERROR_FIELDS, USER_ID } from "../utils/const";
import { handleError } from "../utils/errorHelper";

const Login = ({ setLoggedIn }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    login: true,
    user: "",
    password: "",
    name: "",
    errors: {
      name: "",
      user: "",
      password: "",
    },
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formData.user,
      password: formData.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token); // TODO: move jwt to httpOnly cookie rather than localstorage
      localStorage.setItem(USER_ID, login.user.id);
      history.push("/");
      setLoggedIn(true);
    },
    onError: (err) => {
      const errors = handleError(err.message, LOGIN_ERROR_FIELDS);
      setFormData({ ...formData, errors: errors });
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formData.name,
      email: formData.user,
      password: formData.password,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token); // TODO: move jwt to httpOnly cookie rather than localstorage
      history.push("/");
      setLoggedIn(true);
    },
    onError: (err) => {
      const errors = handleError(err.message, LOGIN_ERROR_FIELDS);
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
      if (formData.login) login();
      else signup();
    }
  };

  const formIsValid = (errors) => {
    let valid = true;
    Object.values(errors).forEach((err) => err.length > 0 && (valid = false));
    return valid;
  };

  const validate = (name, value) => {
    let errors = formData.errors;
    switch (name) {
      case "name":
        errors.name =
          value.length < 4 && !formData.login
            ? "Name must be at least 4 characters"
            : "";
        break;
      case "user":
        errors.user = value.length === 0 ? "Please provide an email" : "";
        break;
      case "password":
        errors.password =
          value.length < 6 ? "Password must be at least 6 characters" : "";
        break;
      default:
        break;
    }
    return errors;
  };

  return (
    <Grid id="form-container" textAlign="center" verticalAlign="middle">
      <Grid.Column width={8}>
        <Segment raised padded>
          <Header>{formData.login ? "Login" : "Sign Up"}</Header>
          <Form
            size="large"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {!formData.login && (
              <Form.Field>
                <Form.Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name"
                  error={
                    formData.errors.name ? formData.errors.name : undefined
                  }
                />
              </Form.Field>
            )}
            <Form.Field>
              <Form.Input
                name="user"
                value={formData.user}
                onChange={handleChange}
                type="text"
                placeholder="Enter your user"
                error={formData.errors.user ? formData.errors.user : undefined}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                error={
                  formData.errors.password
                    ? formData.errors.password
                    : undefined
                }
              />
            </Form.Field>
            <Button
              className="form-button"
              fluid
              color={formData.login ? "teal" : "blue"}
              onClick={handleSubmit}
            >
              {formData.login ? "Login" : "Create Account"}
            </Button>
            <Button
              className="form-button"
              fluid
              color="black"
              onClick={(e) => {
                setFormData({ ...formData, login: !formData.login });
              }}
            >
              {formData.login
                ? "Create an account"
                : "Already have an account?"}
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
