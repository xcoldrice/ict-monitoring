import React from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Cms from './Cms';
import Radars from './Radars';
import WeatherStations from './WeatherStations';

function Dashboard() {

    return (        
            <Row>
                <Col sm md="7" lg="5">
                    <Radars/>
                </Col>
                <Col sm md="5" lg="4">
                    <WeatherStations/>
                </Col>
                <Col sm md lg="3"> 
                    <Cms/>
                </Col>
            </Row>
    );

}

export default Dashboard;