import React from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Radars from './Radars';
import WeatherStations from './WeatherStations';

function Dashboard() {

    return (        
            <Row>
                <Col xs sm md="8" lg="8">
                    <Radars/>
                </Col>
                <Col xs sm md="4" lg="4">
                    <WeatherStations/>
                </Col>
            </Row>
    );

}

export default Dashboard;