import React,{useContext, useEffect, useState} from 'react';
import { Row,Col, Table,Button,Badge} from 'react-bootstrap';
import {RadarContext} from './../contexts/RadarContext';
import { ACTIONS } from './../contexts/RadarContext';
import RadarStatusModal from '../modals/RadarStatusModal';
import Icon from './../layouts/Icon';

function Radars() {
    let {radars,recipients,dispatch} = useContext(RadarContext);
    let [showModal, setShowModal] = useState(false);

    let [selectRadar,setSelectRadar] = useState({});

    const show_modal_handle = ({name,status,remarks}) => {
        setSelectRadar({name,remarks,status});
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

            {/* {data_.map((v) => <td key={v[0]}>{render_data_icons(v[1])}</td>) } */}
        </>
    }

    const check_radar_status = (radar) => {
        switch (radar.status) {
            case 0:
                return <td className='text-capitalize' colSpan={recipients.length}> <Badge bg='danger'>DOWN</Badge> {radar.remarks?? ''} </td>
                break;
            case 2:
                return <td className='text-capitalize' colSpan={recipients.length}><Badge bg='secondary'>UNDER DEVELOPMENT</Badge></td>
                break;
            default:
                return render_data_fields(radar.data);
                break;
        }


    }

    const render_radars = () => {
        return <>
            {radars.map(radar=> {
                return <tr key={radar.name}>
                            <td className='text-center'>
                                <a href="#" className='text-reset text-decoration-none' onClick={()=>show_modal_handle(radar)} >{radar.name} {radar.category}</a>
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
                {/* <Button onClick={()=>dispatch({type:ACTIONS.RADAR_DATA_UPDATE,payload:{'name':'bohol','type':'z','recipient':'dic','file':'sample.text','time':Date.now()}})}>test update</Button> */}
                {/* <Button onClick={()=>dispatch({type:ACTIONS.RADAR_DATA_UPDATE,payload:{'name':'bohol','type':'v','recipient':'dic','file':'sample.text','time':Date.now()}})}>test update</Button> */}

                </Col>
            </Row>
    )
}

export default Radars;