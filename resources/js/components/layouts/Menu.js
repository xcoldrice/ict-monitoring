import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, Button} from 'react-bootstrap';
import {BrowserRouter,Link,Routes,Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Radars from '../pages/Radars';
import WeatherStations from '../pages/WeatherStations';
import Cms from '../pages/Cms';
import Moment from 'react-moment';

function Menu() {

    const render_button = () => {
        if(window.user_name == "Guest") {
            return <>
                    <NavDropdown.Item onClick={() => window.location.href = '/login'}>
                        Login
                    </NavDropdown.Item>
            </>
        }
        return <>
            <NavDropdown.Item onClick={() => document.getElementById('logout-form').submit()}>
                Logout
            </NavDropdown.Item>
        </> 

    }
    return (
        <BrowserRouter>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src="https://pubfiles.pagasa.dost.gov.ph/pagasaweb/images/pagasa-logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        />{' '}
                        ICT Monitoring Tool
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/react/radar">Radars</Nav.Link>
                        <Nav.Link as={Link} to="/react/aws">Weather Stations</Nav.Link>
                        <Nav.Link as={Link} to="/react/cms">PAGASA CMS Data</Nav.Link>

                    </Nav>
                    <Navbar.Text>
                        <Moment format='MMMM D YYYY, h:mm:ss A' interval={1000}/>
                    </Navbar.Text>
                    <NavDropdown title={window.user_name} id="nav-dropdown" align='end'>
                        <Form method='POST' id="logout-form" action='/logout'>
                            <input type="hidden" name='_token' value={document.getElementById("csrf").content}/>
                        </Form>
                        {render_button()}
                    </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route exact path="/" element={<Dashboard/>}/>
                <Route exact path="/react/radar" element={<Radars/>}/>
                <Route exact path="/react/aws" element={<WeatherStations/>}/>
                <Route exact path="/react/cms" element={<Cms/>}/>
            </Routes>      
        </BrowserRouter>
    );

}

export default Menu;