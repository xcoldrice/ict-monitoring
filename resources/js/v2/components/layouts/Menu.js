import React from 'react';
import { Col, Container, Form, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import Moment from 'react-moment';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Radar from '../pages/Radar';
import Radars from '../pages/Radars';
import Temperatures from '../pages/Temperatures';
import WeatherStations from '../pages/WeatherStations';

function Menu() {
    let logo = "https://pubfiles.pagasa.dost.gov.ph/pagasaweb/images/pagasa-logo.png";
    return <>
        <BrowserRouter>
            <Container fluid className='p-0'>
                <Navbar bg="dark" expand="lg" variant="dark">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
                            <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top"/>
                            {" "} ICT Monitoring Tool
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/react/radars">Radars</Nav.Link>
                                <Nav.Link as={Link} to="/react/aws">Weather Stations</Nav.Link>
                                <Nav.Link as={Link} to="/react/temperatures">Room Temperatures</Nav.Link>
                            </Nav>
                            <Navbar.Text>
                                <Moment format="MMMM D YYYY, h:mm:ss A" interval={1000}/>
                            </Navbar.Text>
                            <NavDropdown title={window.user_name} id="nav-dropdown" align="end">
                                <Form method="POST" id="logout-form" action="/logout">
                                    <input type="hidden" name="_token" value={document.getElementById("csrf").content}/>
                                </Form>
                                <NavDropdown.Item onClick={() => window.user_name == 'Guest' ? (window.location.href = "/login") : document.getElementById("logout-form").submit()}>
                                    {window.user_name == 'Guest' ? 'Login':'Logout'}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>
            <Container fluid className='pt-2'>
                <Routes>
                    <Route 
                        exact 
                        path="/" 
                        element={<Dashboard />} 
                    />
                    <Route 
                        exact 
                        path="/react/radars" 
                        element={
                            <Row>
                                <Col xl xxl={{ offset:2, span:8 }}>
                                    <Radars />
                                </Col>
                            </Row>
                        } 
                    />
                    <Route
                        exact
                        path='/react/radars/:name'
                        element={
                            <Row>
                                <Col xl xxl={{ offset:2, span:8 }}>
                                    <Radar/>
                                </Col>
                            </Row>
                        }
                    />
                    <Route 
                        exact 
                        path="/react/aws" 
                        element={
                            <Row>
                                <Col xl xxl={{ offset:2, span:8 }}>
                                    <WeatherStations />
                                </Col>
                            </Row>
                        } 
                    />
                    <Route 
                        exact 
                        path="/react/temperatures" 
                        element={
                            <Row>
                                <Col xl xxl={{ offset:2, span:8 }}>
                                    <Temperatures />
                                </Col>
                            </Row>
                        } 
                    />
                </Routes>
            </Container>

        </BrowserRouter>
    </>
}

export default Menu;
