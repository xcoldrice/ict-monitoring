import React, {useContext, useState} from 'react';
import { Badge, Button, Col, Row, Table } from 'react-bootstrap';
import ModelFormModal from '../modals/ModelFormModal';
import { CacheModelContext } from '../contexts/CacheModelContext';


function Cms() {

    let {models, dispatch} = useContext(CacheModelContext);

    let [showModal, setShowModal] = useState(false);

    let [model, setModel] = useState({
        id: "",
        name: '',
        category: '',
        status: 2,
        remarks: "",
        edit:false
    });

    const open_modal = (data) => {
        let {status, remarks} = data.status;
        remarks = remarks?? "";
        
        setModel(pre => ({...pre, ...data, status, remarks}));

        setShowModal(true);
    }

    const render_status = ({status, remarks}) => {
        if(status == 1) {
            return <>
                <Badge bg="success" text='light'>ok</Badge>
            </>
        }
        
        if(status == 0) {
            return <>
                <Badge bg="danger">down</Badge>
            </> 
        }

        if(status == 2) {
            return <>
                <Badge bg="light" text={'secondary'}>
                    UNDER DEVELOPMENT
                </Badge>
            </>
        }

        return remarks;
    }

    return <Row>
        <Col>
            <ModelFormModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                dispatch={dispatch}
                model={model}
                setModel={setModel}
            />
            <h4>
                <Badge bg="light" text="success">PAGASA CMS Data</Badge>
            </h4>
            <Table bordered hover striped responsive size='sm'>
                <thead>
                    <tr>
                        <th>
                            Model
                            <Button 
                                className='mx-2' 
                                variant='primary' 
                                type='button' 
                                size='sm' 
                                onClick={()=>open_modal({...model, edit:false})}
                            >
                                Add Model
                            </Button>
                        </th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model, index)=> {
                        return <tr key={index}>
                            <td>
                                <a href='#' className='text-decoration-none text-reset px-2' 
                                    onClick={() => open_modal({...model, edit:true})}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </a>
                                {model.name}
                            </td>
                            <td className='text-capitalize'>{model.category}</td>
                            <td>
                                {render_status(model.status)}
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Col>
    </Row>
}

export default Cms;
