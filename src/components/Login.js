import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { useMutation, gql } from "@apollo/client";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

import { AUTH_TOKEN } from "../utils/const";
import { handleError } from "../utils/loginHelper";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ setLoggedIn }) => {
  const history = useHistory();
  const [errorState, setErrorState] = useState(false);
  const [formData, setFormData] = useState({
    login: true,
    email: "",
    password: "",
    name: "",
  });
  const errMessage = useRef({ user: "", email: "", password: "" });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formData.email,
      password: formData.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token); // TODO: move jwt to httpOnly cookie rather than localstorage
      history.push("/");
      setLoggedIn(true);
    },
    onError: (err) => {
      console.log(errMessage.current);
      errMessage.current = handleError(err.message);
      console.log(errMessage.current);
      setErrorState(true);
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token); // TODO: move jwt to httpOnly cookie rather than localstorage
      history.push("/");
      setLoggedIn(true);
    },
    onError: (err) => {
      errMessage.current = handleError(err.message);
      setErrorState(true);
    },
  });

  const onClickLoginHelper = () => {
    if (formData.email && formData.password) {
      if (!formData.login && formData.name) {
        signup();
      }
      formData.login && login();
      setErrorState(false);
      return;
    }
    errMessage.current.name = formData.name ? "" : "Please enter a name";
    errMessage.current.user = formData.email
      ? ""
      : "Please enter an email address";
    errMessage.current.password = formData.password
      ? ""
      : "Please enter a password";
    setErrorState(true);
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type="text"
                  placeholder="Enter your name"
                  error={
                    errorState && errMessage.current.name
                      ? errMessage.current.name
                      : undefined
                  }
                />
              </Form.Field>
            )}
            <Form.Field>
              <Form.Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="text"
                placeholder="Enter your email"
                error={
                  errorState && errMessage.current.user
                    ? errMessage.current.user
                    : undefined
                }
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                placeholder="Enter your password"
                error={
                  errorState && errMessage.current.password
                    ? errMessage.current.password
                    : undefined
                }
              />
            </Form.Field>
            <Button
              className="form-button"
              fluid
              color={formData.login ? "teal" : "blue"}
              onClick={onClickLoginHelper}
            >
              {formData.login ? "Login" : "Create Account"}
            </Button>
            <Button
              className="form-button"
              fluid
              color="black"
              onClick={(e) => {
                setFormData({ ...formData, login: !formData.login });
                setErrorState(false);
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
