import React,{useContext, useState} from 'react';
import { Row,Col, Table,Badge,} from 'react-bootstrap';
import {RadarContext} from './../contexts/RadarContext';
import { ACTIONS } from './../contexts/AppContext';
import RadarStatusModal from '../modals/RadarStatusModal';
import Icon from '../layouts/Icon';

function Radars() {
    let {radars, recipients, dispatch} = useContext(RadarContext);

    let [showModal, setShowModal] = useState(false);

    let [selectRadar,setSelectRadar] = useState({});

    const show_modal = (radar) => {
        setSelectRadar(radar);
        setShowModal(true);
    }

    const render_headers = () => {
        return <> 
            <tr>
                <th className='text-center'>Radar Name</th>
                {recipients.map(recipient => 
                    <th key={recipient} className='text-center text-uppercase'>
                        {recipient}
                    </th>
                )}  
            </tr>
        </>
    }

    const render_data = (array) => {
        return array.map((item, index) => {
            let { file, name, type, recipient, category } = item;
            let tooltip = `File: ${file}`;
            
            return <Icon 
                    key={index}
                    tooltip={tooltip}
                    className={`${name}-${category}-${recipient}-${type}`}
                    {...item}
                >
                    {type}
                </Icon>
        });
    }

    const render_fields = data => {
        return <>
            {recipients.map(recipient => {
                let values = data[recipient]?? [];
                return <td key={recipient}>
                    {render_data(values)}
                </td>
            })}
        </>
    }

    const check_status = (radar) => {
        let {status, remarks, data} = radar;

        if(status == 0) {
            return <>
                <td className='text-capitalize' style={{wordBreak:'break-all'}} 
                        colSpan={recipients.length}> 
                    <Badge bg='none' text='danger'>DOWN</Badge> {remarks?? ''} 
                </td>
            </>
        }
        if(status == 2) {
            return <>
                <td className='text-capitalize' colSpan={recipients.length}>
                    <Badge bg="none" text='secondary'>UNDER DEVELOPMENT</Badge>
                </td>
            </>
        }
        
        return render_fields(data);
    }

    const render_radars = () => {
        return <>
            {radars.map(radar=> {
                let {name, category} = radar,
                    updateBtn = <a href='#' className='text-decoration-none text-reset px-2' 
                            onClick={()=>show_modal(radar)}>
                        <i className="bi bi-pencil-square"></i>
                    </a>
                return <tr key={`${name}-${category}`}>
                    <td style={{verticalAlign:"middle"}}>
                        <div className='px-2' style={{whiteSpace:"nowrap"}}>
                            {window.user_name != 'Guest' && name != 'mosaic'? updateBtn:''}
                            <span className='text-capitalize' style={{fontWeight:"bold", opacity:.75}}>
                                {`${name} ${category}`}
                            </span> 
                        </div>
                    </td>
                    {check_status(radar)}
                </tr>
            })}
        </>
    }

    return (
            <Row>
                <Col>
                    <h4>
                        <Badge bg="light" text="success">Radar Data</Badge>
                    </h4>
                    <RadarStatusModal 
                        show={showModal} 
                        setShow={setShowModal} 
                        radar={selectRadar} 
                        setRadar={setSelectRadar}
                        dispatch={dispatch} action={ACTIONS.RADAR_STATUS_UPDATE}
                    />
                    <Table striped bordered hover responsive size='sm'>
                        <thead>{render_headers()}</thead>
                        <tbody>{render_radars()}</tbody>
                    </Table>
                </Col>
            </Row>
    )
}

export default Radars;