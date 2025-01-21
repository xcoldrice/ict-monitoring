import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Form, Placeholder, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RadarContext } from '../contexts/RadarContext';
import DataBadge from '../layouts/DataBadge';
import RadarStatusModal from '../layouts/RadarStatusModal';
import Remarks from '../layouts/Remarks';
import RemarksModal from '../layouts/RemarksModal';
import StatusBadge from '../layouts/StatusBadge';

const defaultStatus = { active: true, down: true, under_development: true };

let excludeds = ['netcdf', 'img', 'kml'];

let dataTypes = ['vol', 'rawz', 'rawv', 'uf', 'img', 'kml', 'netcdf'];

let mosaicTypes = ['cmax','cappi', 'hybrid']


function Radars() {

    let { recipients, radars, offsets } = useContext(RadarContext); 

    const [status, setStatus] = useState(JSON.parse(localStorage.getItem("radar_status")) ?? defaultStatus);

    const [statusShow, setStatusShow] = useState(false);

    const [remarksShow, setRemarksShow] = useState(false);

    const [selectedRadar, setSelectedRadar] = useState({});

    const [selectedRemark, setSelectedRemark] = useState({});

    let ellipsisStyle = { overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" };

    let filteredRadars = radars.filter(({ status : st}) =>

        (st.status == "active" && status.active) 

        || (st.status == "warning" && status.warning) 

        || (st.status == "down" && status.down) 

        || (st.status == "under_development" && status.under_development)

    );
    const handle_click = (event) => {

        setStatus((pre) => ({ ...pre, [event.target.name] : event.target.checked }));

    }

    const handle_add_click = (radar) => {

        setSelectedRadar(radar);

        setRemarksShow(pre => !pre);

    }

    const get_radar_count = (status) => {

        return radars.filter((radar) => radar.status.status == status).length

    }

    const render_data = (recipient, obj = {}) => {

        let array = obj[recipient] ?? [];

        let types = (recipient == "api" ? mosaicTypes : dataTypes).filter((t) => !excludeds.includes(t));

        array = array.filter((a) => !excludeds.includes(a.type));

        if(array.length == 0) {
            return <>
                <Placeholder bg='light' style={{ cursor:"default" }}>
                    {(recipient == 'api' ? [0, 1, 2] : [0, 1]).map((c) => <React.Fragment key={c}>
                            <Placeholder as={Badge} bg="secondary" style={{ cursor:"default" }}>+</Placeholder>{" "}
                        </React.Fragment>
                    )}
                </Placeholder>
            </>
        }

        return array.map((value, index) => {
            let {interval, threshold} = offsets[value.category] ?? offsets.default;

            return <React.Fragment key={index}>
                <DataBadge 
                    text={value.type} 
                    tooltip={<>
                        Filename: {value.file} <br/>
                        {moment(value.time).format("[Datetime: ]LLL")} <br/>
                        Interval: {interval} minutes <br/>
                        Threshold: {threshold} minutes
                    </>} 
                    time={value.time}  
                    interval={interval}
                    threshold={threshold}
                />
            </React.Fragment>
        });

    }   

    useEffect(() => {

        localStorage.setItem("radar_status", JSON.stringify(status));

    }, [status]);

    return <>
        <RadarStatusModal
            selectedRadar={selectedRadar}
            setSelectedRadar={setSelectedRadar}
            show={statusShow}
            setShow={setStatusShow}
        />
        <RemarksModal
            selectedRadar={selectedRadar}
            selectedRemark={selectedRemark}
            setSelectedRemark={setSelectedRemark}
            show={remarksShow}
            setShow={setRemarksShow}
        />
        <Card>
            <Card.Header style={{ background:"#0d6efd", color: "white", fontWeight: "bold" }}>
                Radar Data Distribution
            </Card.Header>
            <Card.Body className='p-0'>
                <Card.Title>
                    <Container>
                        <Row>
                            <Col className='d-flex flex-row justify-content-end'>
                                {['active','warning', 'down', 'under_development'].map((stat, index) => 
                                    <React.Fragment key={stat}>
                                        <Form.Check
                                            label={`${stat.replace("_", " ").toUpperCase()} (${get_radar_count(stat)})`}
                                            checked={status[stat]}
                                            onChange={handle_click}
                                            name={stat}
                                            inline
                                        />    
                                    </React.Fragment>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Card.Title>
                <Table bordered size='sm' className='mb-0' responsive hover>
                    <thead>
                        <tr>
                            <th className='text-center' rowSpan={2} style={{ verticalAlign:"middle" }}>
                                STATION
                            </th>
                            <th className='text-center' rowSpan={2} style={{ verticalAlign:"middle" }}>
                                TYPE
                            </th>
                            <th className='text-center' colSpan={3}>
                                STATUS
                            </th>
                            <th className='text-center' colSpan={4}>
                                DATA
                            </th>
                            <th className='text-center' rowSpan={2} style={{ verticalAlign:"middle" }}>
                                OTHER REMARKS
                            </th>
                        </tr>
                        <tr>
                            <th className='text-center' style={{ maxWidth:"60px", ...ellipsisStyle}}>
                                RADAR
                            </th>
                            <th className='text-center' style={{ maxWidth:"60px", ...ellipsisStyle}}>
                                NETWORK
                            </th>
                            <th className='text-center' style={{ maxWidth:"60px", ...ellipsisStyle}}>
                                WORKSTATION
                            </th>
                            {recipients.map((recipient, index) => <React.Fragment key={index}>
                                <th className='text-center'>{recipient.toUpperCase()}</th>
                            </React.Fragment>)}
                        </tr>
                    </thead>
                    <tbody>
                        {radars.length == 0 
                            && (status.active || status.warning || status.down || status.under_development)
                            ? <>
                                <tr>
                                    <td colSpan={10} className='text-center'>
                                        <Spinner animation="border" role="status" size='sm'>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </td>
                                </tr>
                            </>
                            : <>
                                {filteredRadars.map((radar, index) => <React.Fragment key={index}>
                                    <tr 
                                        style={{ background: radar.name == "mosaic" ? "aqua" : "none"}}
                                    >
                                        <td 
                                            className='text-uppercase text-center' 
                                            style={{verticalAlign:"middle", fontWeight:"bold"}}
                                        >   
                                            <Link to={`/react/radars/${radar.name}-${radar.category}`}>
                                                {radar.name}
                                            </Link>
                                        </td>
                                        <td 
                                            className='text-uppercase text-center' 
                                            style={{verticalAlign:"middle", fontWeight:"bold"}}
                                        >
                                            {radar.category}
                                        </td>
                                        <StatusBadge 
                                            data={radar} 
                                            type="radar"
                                            setSelectedRadar={setSelectedRadar} 
                                            setStatusShow={setStatusShow}
                                        />
                                        <StatusBadge 
                                            data={radar} 
                                            type="network"
                                            setSelectedRadar={setSelectedRadar} 
                                            setStatusShow={setStatusShow}
                                        />
                                        <StatusBadge 
                                            data={radar} 
                                            type="work_station"
                                            setSelectedRadar={setSelectedRadar} 
                                            setStatusShow={setStatusShow}
                                        />
                                        {recipients.map((recipient, index) => <React.Fragment key={index}>
                                            <td style={{verticalAlign:"middle"}}>
                                                {render_data(recipient, radar.data)}
                                            </td>
                                        </React.Fragment>)}
                                        <td style={{verticalAlign:"middle"}}>
                                            <Remarks 
                                                remarks={radar.remarks}
                                                setSelectedRemark={setSelectedRemark}
                                                show={remarksShow}
                                                setShow={setRemarksShow} 
                                            />
                                            {radar.name != "mosaic" && window.user_name != "Guest" && <>
                                                <Badge 
                                                    bg="info" 
                                                    text='secondary'
                                                    style={{ margin:"0px 2px", cursor:"pointer"}} 
                                                    onClick={e => handle_add_click(radar)}
                                                >
                                                    +
                                                </Badge>
                                            </>}
                                        </td>
                                    </tr>
                                </React.Fragment>
                                )}
                            </>
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </>
}

export default Radars;