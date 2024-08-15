import moment from 'moment';
import React, { useContext } from 'react';
import { Card, Table } from 'react-bootstrap';
import Moment from 'react-moment';
import { TemperatureContext } from '../../../v2/components/contexts/TemperatureContext';

function Temperatures() {
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
        <Card>
            <Card.Header style={{ background:"#0d6efd", color: "white", fontWeight: "bold" }}>
                Room Temperatures
            </Card.Header>
            <Card.Body className='p-0'> 
               <Table bordered size='sm' className='mb-0' responsive>
                    <thead>
                        <tr>
                            <th className='text-center' style={{ fontWeight:"bold", verticalAlign:"middle" }}>
                                ROOM
                            </th>
                            <th className='text-center' style={{ fontWeight:"bold", verticalAlign:"middle" }}>
                                TEMPERATURE
                            </th>
                            <th className='text-center' style={{ fontWeight:"bold", verticalAlign:"middle" }}>
                                HUMIDITY
                            </th>
                            <th className='text-center' style={{ fontWeight:"bold", verticalAlign:"middle" }}>
                                DATETIME
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {temperatures.map((temp, i) => {
                            return <React.Fragment key={i}>
                                <tr>
                                    <td 
                                        className='text-center text-uppercase' 
                                        style={{ fontWeight:"bold", verticalAlign:"middle" }}
                                    >
                                        {temp.room}
                                    </td>
                                    <td 
                                    className='text-center text-uppercase' 
                                    style={{
                                        backgroundColor: temperatureColor(temp?.temperature ?? 0), 
                                        color: temp?.temperature > 24? 'white':'black',
                                        fontWeight:'bold',
                                        verticalAlign:"middle"
                                    }}
                                >
                                    {temp.temperature?? ""} &deg; C
                                </td>
                                <td 
                                    className='text-center text-uppercase' 
                                    style={{backgroundColor: humidityColor(temp?.humidity?? 0),
                                        color:temp?.humidity >= 60? 'white':'black', 
                                        fontWeight:'bold',
                                        verticalAlign:"middle"
                                    }}
                                >
                                    {temp.humidity?? ""} %
                                </td>
                                <td 
                                    className='text-center text-uppercase' 
                                    style={{
                                        backgroundColor: (moment().diff(temp.datetime) > (60 * 60 * 1000)) ? '#dc3545' :'lightblue', 
                                        color: (moment().diff(temp.datetime) > (60 * 60 * 1000)) ? 'white' :'black',
                                        fontWeight:'bold',
                                        verticalAlign:"middle"
                                    }}
                                >
                                    <Moment format='LLL'>{temp.datetime}</Moment>
                                </td>
                                </tr>
                            </React.Fragment>
                        })}
                    </tbody>
                </Table> 
            </Card.Body>
        </Card>
    </>
}

export default Temperatures;