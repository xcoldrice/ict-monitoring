import React from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Radars from './Radars';
import WeatherStations from './WeatherStations';

function Dashboard() {

    return (        
            <Row>
                <Col xs sm md="7" lg="7">
                    <Radars/>
                </Col>
                <Col xs sm md="5" lg="5">
                    <WeatherStations/>
                </Col>
            </Row>
    );

}

export default Dashboard;