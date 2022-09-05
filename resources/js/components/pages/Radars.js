import React,{useContext, useState} from 'react';
import { Row,Col, Table,Badge,} from 'react-bootstrap';
import {RadarContext} from './../contexts/RadarContext';
import { ACTIONS } from './../contexts/AppContext';
import RadarStatusModal from '../modals/RadarStatusModal';
import Icon from './../layouts/Icon';

function Radars() {
    let {radars,recipients,dispatch} = useContext(RadarContext);

    let [showModal, setShowModal] = useState(false);

    let [selectRadar,setSelectRadar] = useState({});

    const show_modal_handle = (radar) => {
        setSelectRadar(radar);
        setShowModal(true);
    }

    const render_headers = () => {
        return <> 
            <tr>
                <th className='text-center' style={{minWidth:"200px"}}>Radar Name</th>
                {recipients.map(recipient => 
                    <th className='text-center text-uppercase' key={recipient}>
                        {recipient}
                    </th>
                )}  
            </tr>
        </>
    }

    const render_data_fields = data => {
        return <>
            {recipients.map(recipient => {
                let values = data[recipient]?? [];
                return <td key={recipient}>
                        {values.map(value => 
                            <Icon key={`${value.type}-${value.time}`} {...value}/>
                        )}
                    </td>
            })}
        </>
    }

    const check_radar_status = (radar) => {
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
        
        return render_data_fields(data);
    }

    const render_radars = () => {
        return <>
            {radars.map(radar=> {
                let {name, category} = radar;
                let updateBtn = "";
                
                if(name != 'mosaic') {
                    updateBtn = <a href='#' className='text-decoration-none text-reset px-2' 
                                        onClick={()=>show_modal_handle(radar)}>
                                    <i className="bi bi-pencil-square"></i>
                                </a>
                }

                return <tr key={`${name}-${category}`}>
                            <td>
                                <div className='px-2'>
                                    {window.user_name != 'Guest' && updateBtn}
                                    <span className='text-capitalize'>{`${name} ${category}`}</span> 
                                </div>
                            </td>
                            {check_radar_status(radar)}
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