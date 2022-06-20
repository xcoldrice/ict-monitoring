import React, { useContext } from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import Icon from '../layouts/Icon';
import {WeatherStationContext} from './../contexts/WeatherStationContext';

function WeatherStations() {

    let {dataset} = useContext(WeatherStationContext);

    const render_fields = (type) => {
        return dataset.filter(data => data.category == type)
                    .map((data, index) => <Icon key={index} {...data}/>);
    }

    return (
            <Row>
                <Col>
                <Table striped bordered hover responsive size='sm'>
                    <thead>
                        <tr>
                            <th className='text-center'>aws</th>
                            <th className='text-center'>arg</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{render_fields('aws')}</td>
                            <td>{render_fields('arg')}</td>
                        </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>
    );
}

export default WeatherStations;