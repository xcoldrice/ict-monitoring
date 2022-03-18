import React,{useContext, useEffect, useState} from 'react';
import { Row,Col, Table,Button,Badge} from 'react-bootstrap';
import {RadarContext} from './../contexts/RadarContext';
import { ACTIONS } from './../contexts/AppContext';
import RadarStatusModal from '../modals/RadarStatusModal';
import Icon from './../layouts/Icon';

function Radars() {
    let {radars,recipients,dispatch} = useContext(RadarContext);
    
    let [showModal, setShowModal] = useState(false);

    let [selectRadar,setSelectRadar] = useState({});

    const show_modal_handle = ({name,status,remarks,category}) => {
        setSelectRadar({name,remarks,status,category});
        setShowModal(true);
    }

    const hide_modal_handle = () => {
        setSelectRadar({});
        setShowModal(false);
    }

    const render_headers = () => {
        return <tr>
                <th className='text-center'>name</th>
                {recipients.map(recipient => <th className='text-center' key={recipient}>{recipient}</th>)}  
            </tr>
    }
    
    const render_data_icons  = (values) => {
        let {type,time,file} = values;
        
        return <Icon {...values} />
    }

    const render_data_fields = data => {
        return <>
            {recipients.map(r => {
                let data_ = data[r]?? [];
                return <td key={r}>
                        {data_.map(d => <React.Fragment key={`${d.type}-${d.time}`}>{render_data_icons(d)}</React.Fragment> )}
                    </td>
            })}
        </>
    }

    const check_radar_status = (radar) => {
        switch (radar.status) {
            case 0:
                return <td className='text-capitalize' colSpan={recipients.length}> <Badge bg='danger'>DOWN</Badge> {radar.remarks?? ''} </td>
                break;
            case 2:
                return <td className='text-capitalize' colSpan={recipients.length}> <Badge bg='secondary'>UNDER DEVELOPMENT</Badge></td>
                break;
            default:
                return render_data_fields(radar.data);
                break;
        }
    }

    const render_radars = () => {
        return <>
            {radars.map(radar=> {
                return <tr key={`${radar.name}-${radar.category}`}>
                            <td>
                                <div className='px-2'>
                                    <a href='#' className='text-decoration-none text-reset px-2' onClick={()=>show_modal_handle(radar)}><i className="bi bi-pencil-square"></i></a>
                                    <span>{radar.name} {radar.category} </span> 
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
                <RadarStatusModal show={showModal} close={hide_modal_handle} radar={selectRadar} setRadar={setSelectRadar} dispatch={dispatch} action={ACTIONS.RADAR_STATUS_UPDATE}/>
                <Table striped bordered hover>
                    <thead>
                        {render_headers()}
                    </thead>
                    <tbody>
                        {render_radars()}
                    </tbody>
                </Table>
                </Col>
            </Row>
    )
}

export default Radars;