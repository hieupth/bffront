/* eslint-disable jsx-a11y/alt-text */
import "./App.css";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
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
          <div className="img-main-content">
            {/* <img
              className="border-img"
              src="/square.png"
              height="550px"
              width="550px"
            /> */}
            <UserImage />
          </div>
        </Row>
      </div>
    </Container>
  );
}

export default App;
