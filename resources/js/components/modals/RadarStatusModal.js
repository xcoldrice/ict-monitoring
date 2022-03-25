import axios from 'axios';
import React,{useState} from 'react';
import {Modal,Button, Form, Badge, Col, Table, Row,Spinner} from 'react-bootstrap';
import {useToasts} from 'react-toast-notifications';

function RadarStatusModal(props) {

    const {addToast} = useToasts();

    let {radar:{name,category,status,remarks}, setShow, setRadar, show} = props;
    let [histories,setHistories] = useState([]);
    let [modalState, setModalState] = useState('update');

    const closeModal = () => {
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
              closeModal() 
    }

    
    const get_status_history = async () => {
        let url = `/radar/${category}/${name}`;
        await axios({method:'GET',url}).then((response)=> {
          console.log(response);
            if(response.data.success) {
              setHistories(response.data.histories);
            };
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

    const render_history = () => {
      return <>
              <Row>
                <Col>
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
                            if(status == 'Down') bg = 'danger';
                            if(status == 'Under Development') bg = 'secondary';
                            return <tr key={index}>
                                      <td style={{width:'150px'}}><Badge bg={bg}>{status}</Badge></td>
                                      <td style={{width:'370px',wordBreak:'break-all'}}>{remarks}</td>
                                      <td style={{width:'170px'}}>{date}</td>
                                    </tr>
                      })}
                    </tbody>
                  </Table>
                </Col>
            </Row>
          </>
    }

    const render_update = () => {
        return <>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label className='d-flex justify-content-between'>Select Status 
                    <small>
                      <a href="#" className='pull-right' onClick={()=>{setModalState('history'); get_status_history()}}>View Status History</a>
                    </small>
                  </Form.Label>
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
            </> 
        

    }


    const render_body = () => {
      switch (modalState) {
        case 'history':
          return render_history()
          break;
        default:
          return render_update()
          break;
      }
    }


    const render_footer = () => {
      switch (modalState) {
        case 'history':
          return <Button variant="primary" onClick={()=>setModalState('update')}>Back</Button>
          break;
        default:
          return <Button variant="primary" onClick={()=>save_status()}>Save Changes</Button>
          break;
      }

    }

    return <>
            <Modal show={show} onHide={()=>closeModal()} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title className='text-capitalize'>update {name} radar status</Modal.Title>
                </Modal.Header>
                  {render_body()}
                <Modal.Footer>
                  <Button variant="secondary" onClick={()=>closeModal()}>Close</Button>
                  {render_footer()}
                </Modal.Footer>
            </Modal>
    </>

}

export default RadarStatusModal;