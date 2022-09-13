import React from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Cms from './Cms';
import Radars from './Radars';
import WeatherStations from './WeatherStations';

function Dashboard() {

    return (        
            <Row>
                <Col sm md lg xl xxl>
                    <Radars/>
                </Col>
                <Col sm md lg xl xxl>
                    <WeatherStations/>
                </Col>
            </Row>
    );

}

export default Dashboard;