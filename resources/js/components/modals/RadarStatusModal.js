import axios from 'axios';
import React,{useState} from 'react';
import {Modal,Button, Form, ListGroup, Badge, ListGroupItem, Table} from 'react-bootstrap';
import {useToasts} from 'react-toast-notifications';

function RadarStatusModal(props) {

    let {radar:{name,category,status,remarks,histories}, close, setRadar, setState, show, state} = props;
    const {addToast} = useToasts();

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
              close() 
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

    const render_modal_body = (state) => {
      switch (state) {
        case 'update':
          return <>
                  <Modal.Body>
                    <Form.Group className="mb-3">
                      <Form.Label className='d-flex justify-content-between'>Select Status <small><a href="#" className='pull-right' onClick={()=>setState('history')}>View Status History</a></small></Form.Label>
                        <Form.Select defaultValue={status} onChange={(e)=>radar_change(e)}>
                            <option className='text-capitalize' value={0}>down</option>
                            <option className='text-capitalize' value={1}>active</option>
                            <option className='text-capitalize' value={2}>under development</option>
                        </Form.Select>
                    </Form.Group>
                      <Form.Group className='mb-3'>
                      <Form.Label>Remarks</Form.Label>
                          <Form.Control as="textarea" placeholder="Leave a comment here" rows={3} onChange={(e)=>radar_change(e)} defaultValue={remarks}/>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>close()}>    
                      Close
                    </Button>
                    <Button variant="primary" onClick={()=>save_status()}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                  </>
          break;
        case 'history':
          return <>
                  <Modal.Body>
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
                              bg = 'success';
                              if(status == 0) bg = 'danger';
                              if(status == 2) bg = 'secondary';
                          return <tr key={index}>
                                    <td style={{width:'150px'}}><Badge bg={bg}>{status}</Badge></td>
                                    <td>{remarks}</td>
                                    <td style={{width:'170px'}}>{date}</td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>close()}>Close</Button>
                    <Button variant="primary" onClick={() => setState('update')}>Back</Button>
                  </Modal.Footer>
          </>
          break;
        default:
          break;
      }
    }

    return <>
            <Modal show={show} onHide={()=>{close()}} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title className='text-capitalize'>update {name} radar status</Modal.Title>
                </Modal.Header>
                {render_modal_body(state)}
            </Modal>
    </>

}

export default RadarStatusModal;