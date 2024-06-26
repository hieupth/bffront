/* eslint-disable jsx-a11y/alt-text */
import "./App.css";
import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserImage from "./components/UserImage";

function App() {
  return (
    <Container>
      <Row>
        <Col md={2} lg={2}></Col>
        <Col xs={12} md={8} lg={8} className='text-align-center'>
          <img className='slogan' src={process.env.PUBLIC_URL + "slogan.png"} max-width="100%" height="100px"></img>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col md={2} lg={2}></Col>
        <Col xs={12} md={8} lg={8} className='text-align-center'>
          <UserImage/>
        </Col>
      </Row>
      {/* <div className="wrap">
        <Row className="justify-content-center container-main">
          <UserImage />
        </Row>
      </div> */}
    </Container>
  );
}

export default App;
