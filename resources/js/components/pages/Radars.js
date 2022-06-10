import React,{useContext, useEffect, useState} from 'react';
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
        return <tr>
                <th className='text-center' style={{minWidth:"200px"}}>name</th>
                {recipients.map(recipient => 
                    <th className='text-center' key={recipient}>
                        {recipient}
                    </th>
                )}  
            </tr>
    }

    const render_data_fields = data => {
        return <>
            {recipients.map(r => {
                let data_ = data[r]?? [];
                return <td key={r}>
                        {data_.map(d => 
                            <React.Fragment key={`${d.type}-${d.time}`}>
                                <Icon {...d}/>
                            </React.Fragment> 
                        )}
                    </td>
            })}
        </>
    }

    const check_radar_status = (radar) => {
        let {status, remarks, data} = radar;
        switch (status) {
            case 0:
                return <td className='text-capitalize' style={{wordBreak:'break-all'}} colSpan={recipients.length}> 
                            <Badge bg='none' text='danger'>DOWN</Badge> {remarks?? ''} 
                        </td>
                break;
            case 2:
                return <td className='text-capitalize' colSpan={recipients.length}>
                            <Badge bg="none" text='secondary'>UNDER DEVELOPMENT</Badge>
                        </td>
                break;
            default:
                return render_data_fields(data);
                break;
        }
    }

    const render_radars = () => {
        return <>
            {radars.map(radar=> {
                let {name,category} = radar;
                let key = `${name}-${category}`;
                let rname = `${name} ${category}`;

                let updateBtn = <a href='#' className='text-decoration-none text-reset px-2' onClick={()=>show_modal_handle(radar)}>
                                    <i className="bi bi-pencil-square"></i>
                                </a>
                if (name == 'mosaic') {
                    updateBtn = <a href='#' className='text-decoration-none text-reset px-2' style={{opacity:'0'}}>
                                    <i className="bi bi-pencil-square"></i>
                                </a>;
                }

                return <tr key={key}>
                            <td>
                                <div className='px-2'>
                                    {updateBtn}
                                    <span className='text-capitalize'>{rname}</span> 
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