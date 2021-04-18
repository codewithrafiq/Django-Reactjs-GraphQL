import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useState } from "react";

const AuthPage = () => {
  const [registernow, setRegisternow] = useState(false);
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [tokenAuth] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      console.log("Token Data", data);
      if (data?.tokenAuth?.token) {
        window.localStorage.setItem("token", data?.tokenAuth?.token);
        window.location.href = "/";
      } else {
        alert("Somthing is Wrong! Try Agan!!");
      }
    },
  });
  const [
    createUser,
    { loading: registerloding, error: registerError },
  ] = useMutation(REGISTER_NEW_USER, {
    onCompleted(data) {
      if (data.createUser.user.username) {
        alert(
          `User Was Created For User Name "${data.createUser.user.username}"`
        );
        setRegisternow(false);
      } else {
        alert("Somthing Wrong Try Agan!!");
      }
    },
  });
  const loginNow = () => {
    tokenAuth({ variables: { username: username, password: password1 } });
  };
  const RegisterNewUser = () => {
    if (password1 === password2) {
      createUser({ variables: { username: username, password: password1 } });
    } else {
      alert("Two Password Not Matched,Try Agan!");
    }
  };
  return (
    <Container>
      <Typography align="center" variant="h3">
        {registernow ? "Register Now" : "Login Now"}
      </Typography>
      <Grid
        container
        spacing={3}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Username"
            name="username"
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Password"
            name="password"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword1(e.target.value)}
          />
        </Grid>
        {registernow && (
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Confiem Password"
              name="password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Grid>
        )}
        <Box
          style={{
            margin: "0 auto",
          }}
        >
          {registernow ? (
            <>
              <Button
                onClick={RegisterNewUser}
                color="primary"
                variant="contained"
              >
                Register
              </Button>
              <Button onClick={() => setRegisternow(false)}>
                Have an Account ? Login Now
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={loginNow}
                disabled={!username || !password1}
                color="primary"
                variant="contained"
              >
                Login
              </Button>
              <Button onClick={() => setRegisternow(true)}>
                New in Heare? Register Now
              </Button>
            </>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

const LOGIN_MUTATION = gql`
  mutation LoginNow($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;
const REGISTER_NEW_USER = gql`
  mutation RegisterNow($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      user {
        id
        username
      }
    }
  }
`;

export default AuthPage;
