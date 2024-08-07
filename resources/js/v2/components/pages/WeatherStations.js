import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { WeatherStationContext } from '../contexts/WeatherStationContext';
import DataBadge from '../layouts/DataBadge';

const defaultStatus = { updated: true, late: true, no_data: true };

function WeatherStations() {

    let { prsds, weatherStations, offsets } = useContext(WeatherStationContext); 

    const [status, setStatus] = useState(JSON.parse(localStorage.getItem("aws_status")) ?? defaultStatus);

    let filteredWeatherStations = weatherStations.filter(({status:st}) => 
        (st == "updated" && status.updated) || (st == "late" && status.late) || (st == "no_data" && status.no_data)
    );

    let aws = filteredWeatherStations.filter((aw) => aw.type == "aws");

    let args = filteredWeatherStations.filter((arg) => arg.type == "arg");

    const render_data = (array, prsd = "") => {

        return array.filter((ws) => ws.prsd == prsd).map((ws, i) => {

            let {interval, threshold} = offsets[ws.type] ?? offsets.default;
            return <React.Fragment key={i}>
                <DataBadge 
                    text={ws.siteId} 
                    tooltip={<>
                        Site ID : {ws.siteId} <br/>
                        Site Name : {ws.siteName} <br/>
                        {ws.time != null && <>
                            {moment(ws.time).format("[Datetime: ]LLL")} <br/>
                        </>}
                        Interval : {interval} minutes <br/>
                        Threshold : {threshold} minutes
                    </>} 
                    time={ws.time} 
                    interval={interval} 
                    threshold={threshold}
                />
            </React.Fragment>
        })
    };

    const handleClick = (event) => {

        setStatus((pre) => ({ ...pre, [event.target.name] : event.target.checked }));

    }

    useEffect(() => {
        
        localStorage.setItem("aws_status", JSON.stringify(status));
        
    }, [status]);

    return <>
        <Card>
            <Card.Header style={{ background:"#0d6efd", color: "white", fontWeight: "bold" }}>
                Automatic Weather Stations & Automatic Rain Gauges
            </Card.Header>
            <Card.Body className='p-0'>
                <Card.Title>
                    <Container>
                        <Row>
                            <Col className='d-flex flex-row justify-content-end'>
                                {['updated', 'late', 'no_data'].map((stat) => <React.Fragment key={stat}>
                                    <Form.Check
                                        label={`${stat} (${(weatherStations.filter((ws) => ws.status == stat).length)})`}
                                        name={stat}
                                        checked={status[stat]}
                                        onChange={handleClick}
                                        inline
                                    />    
                                </React.Fragment>)}
                            </Col>
                        </Row>
                    </Container>
                </Card.Title>
                <Table bordered size='sm' className='mb-0'>
                    <thead>
                        <tr>
                            <th style={{ width:"8%" }}>PRSD</th>
                            <th style={{ width:"46%" }}>
                                AWS ({weatherStations.filter((ws) => ws.type == "aws").length})
                            </th>
                            <th style={{ width:"46%" }}>
                                ARG ({weatherStations.filter((ws) => ws.type == "arg").length})
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {weatherStations.length == 0
                            ? <tr>
                                <td colSpan={3} className='text-center'>
                                    <Spinner animation="border" role="status" size='sm'>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </td>    
                            </tr>
                            : <>
                                {prsds.map((prsd, index) => <React.Fragment key={index}>
                                    <tr>
                                        <td className='text-uppercase' style={{ verticalAlign:"middle" }}>
                                            {prsd}
                                        </td>
                                        <td>{render_data(aws, prsd)}</td>
                                        <td>{render_data(args, prsd)}</td>
                                    </tr>
                                </React.Fragment>)}
                                <tr>
                                    <td>????PRSD</td>
                                    <td>{render_data(aws)}</td>
                                    <td>{render_data(args)}</td>
                                </tr>
                        </>}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </>
}

export default WeatherStations;
