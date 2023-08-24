import moment from 'moment';
import React, { useContext } from 'react';
import { Badge, Col, Row, Table } from 'react-bootstrap';
import Moment from 'react-moment';
import { TemperatureContext } from '../contexts/TemperatureContext';
function Temperatures(props) {
    let { temperatures } = useContext(TemperatureContext);

    function temperatureColor(temperature) { 
        if(temperature >= 20 && temperature <= 24 ) {
            return '#ffc107';
        }

        if(temperature > 24) {
            return '#dc3545';
        }

        return 'lightblue';
    }

    function humidityColor(humidity) {
        if(humidity > 50 && humidity < 60) {
            return '#ffc107';
        }

        if(humidity >= 60) {
            return '#dc3545';
        }

        return 'lightblue';

    }


    return <>
        <Row>
            <Col>
                <h4>
                    <Badge bg="light" text="success">
                        Temperatures
                    </Badge>
                </h4>
                <Table bordered responsive size="sm">
                    <thead>
                        <tr>
                            <th className='text-center'>Room</th>
                            <th className='text-center'>Temperature</th>
                            <th className='text-center'>Humidity</th>
                            <th className='text-center'>Datetime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temperatures.map((temp, i) => {
                            return <tr key={i}>
                                <td 
                                    className='text-center' 
                                    style={{fontWeight:'bold'}}
                                >
                                    {temp.room}
                                </td>
                                <td 
                                    className='text-center' 
                                    style={{
                                        backgroundColor: temperatureColor(temp?.temperature ?? 0), 
                                        color: temp?.temperature > 24? 'white':'black',
                                        fontWeight:'bold'
                                    }}
                                >
                                    {temp.temperature?? ""} &deg; C
                                </td>
                                <td 
                                    className='text-center' 
                                    style={{backgroundColor: humidityColor(temp?.humidity?? 0),
                                        color:temp?.humidity >= 60? 'white':'black', 
                                        fontWeight:'bold'
                                    }}
                                >
                                    {temp.humidity?? ""} %
                                </td>
                                <td 
                                    className='text-center' 
                                    style={{
                                        backgroundColor: (moment().diff(temp.datetime) > (60 * 60 * 1000)) ? '#dc3545' :'lightblue', 
                                        color: (moment().diff(temp.datetime) > (60 * 60 * 1000)) ? 'white' :'black',
                                        fontWeight:'bold'}}
                                >
                                    <Moment format='LLL'>{temp.datetime}</Moment>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>
}

export default Temperatures;