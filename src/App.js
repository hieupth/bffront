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
      <Row className="slogan-container">
        <Col md={2} lg={3} className="d-lg-block d-md-block d-none"></Col>
        <Col xs={12} md={8} lg={6} className='text-align-center'>
          <img className='slogan' src={process.env.PUBLIC_URL + "slogan.png"}></img>
        </Col>
      </Row>
      <Row className="panel-container">
        <Col md={2} lg={4} className="d-lg-block d-md-block d-none"></Col>
        <Col xs={12} md={8} lg={4} className='text-align-center'>
          <UserImage/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
