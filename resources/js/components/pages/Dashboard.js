import React from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Radars from './Radars';

function Dashboard() {

    return (        
            <Row>
                <Col>
                    <Radars/>
                </Col>
            </Row>
    );

}

export default Dashboard;