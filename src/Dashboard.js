import React, {useState} from "react";
import { Container, Form } from "react-bootstrap";
import useAuth from "./useAuth";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  return (
    <Container>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></Form.Control>
    </Container>
  );
}
