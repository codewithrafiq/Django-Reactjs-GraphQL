import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
const App = () => {
  const [title, setTitle] = useState("");
  const [todoid, setTodoid] = useState(null);
  const [edittodo, setEdittodo] = useState(false);
  const { loading, error, data } = useQuery(GET_TODOS);
  const { loading: userloding, error: usererror, data: userdata } = useQuery(
    GET_USER_DATA
  );
  const [createTodo] = useMutation(Add_TODO, {
    onCompleted(data) {
      setTitle("");
    },
    refetchQueries: [
      {
        query: GET_TODOS,
      },
    ],
  });
  const [updateTodo] = useMutation(EDIT_TODO, {
    onCompleted(data) {
      console.log("Update todo", data);
      setTitle("");
      setEdittodo(false);
    },
    refetchQueries: [
      {
        query: GET_TODOS,
      },
    ],
  });
  const [delateTodo] = useMutation(DELETE_TODO, {
    onCompleted(data) {
      console.log("Delate todo", data);
    },
    refetchQueries: [
      {
        query: GET_TODOS,
      },
    ],
  });
  const addNewTodo = () => {
    createTodo({ variables: { title: title } });
  };
  const editButtonHandeler = (id, title) => {
    setTitle(title);
    setEdittodo(true);
    setTodoid(parseInt(id));
  };
  const editAtodo = () => {
    updateTodo({ variables: { id: todoid, title: title } });
  };
  const delateSingleTodo = (id) => {
    delateTodo({ variables: { id: id } });
  };
  const logoutNow = () => {
    window.localStorage.clear();
    window.location.href = "/";
  };
  if (loading) return <h1>Loding...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <Container>
      <Typography align="center" variant="h3">
        Welcome to Todo App "{userdata?.user?.username}"
        <Button color="secondary" variant="contained" onClick={logoutNow}>
          Logout
        </Button>
      </Typography>
      <Box
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "flex",
          marginTop: "15px",
        }}
      >
        <TextField
          fullWidth
          value={title}
          id="outlined-basic"
          label={edittodo ? "Edit Todo" : "Add Todo.."}
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
        {edittodo ? (
          <Button
            onClick={editAtodo}
            disabled={!title}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        ) : (
          <Button
            onClick={addNewTodo}
            disabled={!title}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        )}
      </Box>
      <Box
        component="div"
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <List>
          {data?.todos?.map((item, i) => (
            <ListItem button key={i}>
              <ListItemIcon>
                <Avatar
                  style={{
                    backgroundColor: "blue",
                  }}
                >
                  {i + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={item?.title} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => editButtonHandeler(item?.id, item?.title)}
                >
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton
                  onClick={() => delateSingleTodo(parseInt(item?.id))}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

const GET_USER_DATA = gql`
  {
    user {
      id
      username
    }
  }
`;
const GET_TODOS = gql`
  {
    todos {
      id
      title
      date
    }
  }
`;
const Add_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      todo {
        id
        title
        date
      }
    }
  }
`;
const EDIT_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      todo {
        id
        title
        date
      }
    }
  }
`;
const DELETE_TODO = gql`
  mutation DelateTodo($id: Int!) {
    delateTodo(id: $id) {
      message
    }
  }
`;
export default App;
