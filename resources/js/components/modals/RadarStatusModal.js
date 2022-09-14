import axios from 'axios';
import React,{useState} from 'react';
import {Modal,Button, Form, Badge, Table} from 'react-bootstrap';
import {useToasts} from 'react-toast-notifications';
import Moment from 'react-moment';
function RadarStatusModal(props) {

    const {addToast} = useToasts();

    let {radar:{name, category, status, remarks}, setShow, setRadar, show} = props;
    let [histories,setHistories] = useState([]);
    let [modalState, setModalState] = useState('update');

    const close_modal = () => {
      setRadar({});
      setHistories([]);
      setShow(false);
      setModalState('update');
    }

    const save_status = async () => {
        let data = new FormData();
            data.append('name', name);
            data.append('category', category)
            data.append('status', status);
            data.append('remarks', remarks);

        await axios({method:'POST', url:'/radars',data}).then( response => {
                if(response.data.success) return;        
                addToast('Error Updating Radar Status!',{autoDismiss:true,appearance:'error'});
              }).catch( error => {
                addToast('Error Updating Radar Status!',{autoDismiss:true,appearance:'error'});
              });
              close_modal() 
    }

    
    const get_status_history = async () => {
        let url = `/radar/${category}/${name}`;
        await axios({method:'GET',url}).then((response)=> {
            if(response.data.success) setHistories(response.data.histories);
        }).catch((error)=>{
            console.log('error fetching history')
        })
    }

    const radar_change = (e) => {
        let key = 'remarks';
        let value = e.target.value;

        if(e.target.className == 'form-select') {
            key = 'status';
            value = parseInt(e.target.value);
        }

        setRadar(prev=>({...prev,[key]:value}));
    }

    const render_body = () => {

        if(modalState == 'history') {
            return <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history,index)=> {
                            let {status,remarks,date} = history,
                                variant = 'success';

                                if(status == 'Down') {
                                    variant = 'danger';
                                }

                                if(status == 'Under Development') {
                                    variant = 'secondary';
                                }

                                if(status == 'Report') {
                                    variant = 'warning'
                                }

                                return <>
                                    <tr key={index}>
                                        <td style={{width:'10%'}}>
                                            <Badge bg={variant}>{status}</Badge>
                                        </td>
                                        <td style={{width:'60%', wordBreak:'break-all'}}>
                                            {remarks}
                                        </td>
                                        <td style={{width:'30%'}}>
                                            <Moment date={new Date(date)} format="MMMM DD, YYYY h:mm A"/>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </Table>
            </>
        }

        return <>
                <Form.Group className="mb-3">
                    <Form.Label className='d-flex justify-content-between'>Select Status 
                        <small>
                            <a href="#" className='pull-right' 
                                onClick={()=>{setModalState('history'); get_status_history()}}>View Status History</a>
                        </small>
                    </Form.Label>
                    <Form.Select defaultValue={status} onChange={(e)=>radar_change(e)}>
                        <option value="0">down</option>
                        <option value="1">active</option>
                        <option value="2">under development</option>
                        <option value="3">report</option>
                    </Form.Select>
                </Form.Group>
                < Form.Group className='mb-3'>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control as="textarea" placeholder="Leave a comment here" rows={3} 
                        onChange={(e)=>radar_change(e)} defaultValue={remarks}/>
                </Form.Group>
        </>
    }

    const render_footer = () => {
        if(modalState == 'history') {
            return <>
                <Button variant="primary" onClick={()=>setModalState('update')}>
                    Back
                </Button>
            </>
        }

        return <>
            <Button variant="primary" onClick={()=>save_status()}>
                Save Changes
            </Button>
        </>
    }

    return <>
            <Modal show={show} onHide={()=>close_modal()} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        update {name} radar status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{render_body()}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>close_modal()}>
                        Close
                    </Button>
                    {render_footer()}
                </Modal.Footer>
            </Modal>
    </>

}

export default RadarStatusModal;