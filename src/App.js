import { gql, useQuery } from "@apollo/client";
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
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
const App = () => {
  const { loading, error, data } = useQuery(gql`
    {
      todos {
        id
        title
        date
      }
    }
  `);
  if (loading) return <h1>Loding...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <Container>
      <Typography align="center" variant="h3">
        Todo App
      </Typography>
      <Box
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "flex",
        }}
      >
        <TextField
          fullWidth
          id="outlined-basic"
          label="Add Todo.."
          variant="outlined"
        />
        <Button variant="contained" color="primary">
          Add
        </Button>
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
                <IconButton>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton>
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

export default App;
