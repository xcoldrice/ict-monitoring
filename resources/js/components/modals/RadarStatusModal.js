import axios from 'axios';
import React,{useState} from 'react';
import {Modal,Button, Form, FloatingLabel} from 'react-bootstrap';
import {useToasts} from 'react-toast-notifications';

function RadarStatusModal(props) {
    const {addToast} = useToasts();
    const save_status = async () => {
        let data = new FormData();
            data.append('name', props.radar.name);
            data.append('category', props.radar.category)
            data.append('status', props.radar.status);
            data.append('remarks', props.radar.remarks);
        await axios({method:'POST', url:'/radars',data}).then( response => {
                if(response.data.success) {
                  console.log('Success Updating Radar Status');
                }else {
                  addToast('Error Updating Radar Status!',{autoDismiss:true,appearance:'error'});
                }
              }).catch( error => {
                addToast('Error Updating Radar Status!',{autoDismiss:true,appearance:'error'});
              });
              props.close() 
    }

    const radar_change = (e) => {
        let key = 'remarks';
        let value = e.target.value;

        if(e.target.className == 'form-select') {
            key = 'status';
            value = parseInt(e.target.value);
        }

        props.setRadar(prev=>({...prev,[key]:value}));

    }
    return <>
      <Modal show={props.show} onHide={()=>props.close()}>
        <Modal.Header closeButton>
          <Modal.Title className='text-capitalize'>update {props.radar.name} radar status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Select Status</Form.Label>
            <Form.Select defaultValue={props.radar.status} onChange={(e)=>radar_change(e)}>
                <option className='text-capitalize' value={0}>down</option>
                <option className='text-capitalize' value={1}>active</option>
                <option className='text-capitalize' value={2}>under development</option>
            </Form.Select>
        </Form.Group>
        <Form.Control as="textarea" placeholder="Leave a comment here" rows={3} onChange={(e)=>radar_change(e)} defaultValue={props.radar.remarks}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>props.close()}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>save_status()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>

}

export default RadarStatusModal;