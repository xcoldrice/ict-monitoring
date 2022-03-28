import React, { useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import {BrowserRouter,Link,Routes,Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Radars from '../pages/Radars';
import WeatherStations from '../pages/WeatherStations';
import { AppContext } from '../contexts/AppContext';

function Menu() {
    let {setShowLogin} = useContext(AppContext);
    
    return (
        <BrowserRouter>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#home">ICT Monitoring Tool</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/react/radar">Radars</Nav.Link>
                        <Nav.Link as={Link} to="/react/aws">Weather Stations</Nav.Link>
                    </Nav>
                    <NavDropdown title="Guest" id="nav-dropdown" align='end'>
                        <NavDropdown.Item onClick={()=>setShowLogin(true)}>Login</NavDropdown.Item>
                    </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route exact path="/" element={<Dashboard/>}/>
                    <Route exact path="/react/radar" element={<Radars/>}/>
                <Route exact path="/react/aws" element={<WeatherStations/>}/>
            </Routes>      
        </BrowserRouter>
    );

}

export default Menu;