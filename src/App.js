/* eslint-disable jsx-a11y/alt-text */
import "./App.css";
import React from "react";
import { Container, Row } from "react-bootstrap";
import UserImage from "./components/UserImage";

function App() {
  return (
    <Container>
      <Row>
        <img
          className="slogan center"
          src={process.env.PUBLIC_URL + "slogan.png"}
          width="100%"
        ></img>
      </Row>
      <div className="wrap">
        <Row className="justify-content-center container-main">
          <UserImage />
        </Row>
      </div>
    </Container>
  );
}

export default App;
