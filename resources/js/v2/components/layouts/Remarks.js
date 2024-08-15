import moment from 'moment';
import React, { useRef } from 'react';
import { Badge, Button, ButtonGroup, OverlayTrigger, Popover } from 'react-bootstrap';

function Remarks(props) {

    const editRef = useRef();
    const deleteRef = useRef();

    const handle_edit_click = (remark) => {

        props.setShow(true);

        props.setSelectedRemark(remark);

        editRef.current.blur();
    }

    const handle_delete_remark = async (remark) => {
        deleteRef.current.blur();

        if(confirm("Are you sure you want to delete this remark?")) {
                
            let data = new FormData();
            data.append("_method", "put");
            data.append("type", "delete");

            
            await axios({ method: "POST", url:`/remarks/${remark.id}`, data })
                .then((response) => {
    
                    if (response.data.success) return;
    
                    // addToast("Error Updating Radar Status!", { autoDismiss: true, appearance: "error" });
                })
                .catch((error) => {
    
                    // addToast("Error Creating Remarks!", { autoDismiss: true, appearance: "error"});
                    
                });
        }
        
    }
    
    return <> 
        {props.remarks.map((remark, i) => {

            let btnStyle = { border:"0", cursor:"pointer"};

            let textColor = remark.priority_level == "low" ? "secondary" : "light";

            let bgColor = remark.priority_level == "low" ? "warning" : "danger";

            let popover = <Popover style={{ maxWidth: "768px" }}>
                <Popover.Body>
                    Title : {remark.title}<br/>
                    Description : {remark.description}<br/>
                    {remark.latest_status.action == "create" ? "Created by" : "Updated by"} : {remark.latest_status.user.name} <br/>
                    Datetime : {moment(remark.latest_status.created_at).format("LLL")} 
                </Popover.Body>
            </Popover>

            return <React.Fragment key={i}>
                <ButtonGroup style={{ ...btnStyle, margin:"0px 2px" }}>
                    <OverlayTrigger placement='top' overlay={popover}>
                        <Button style={btnStyle} bg={bgColor} text={textColor} size='sm' as={Badge}>
                            {remark.title}
                        </Button>
                    </OverlayTrigger>
                    {window.user_name != "Guest" && <>
                        <OverlayTrigger placement='top' overlay={<Popover>
                            <Popover.Body>
                                Edit Remark
                            </Popover.Body>
                        </Popover>}>
                            <Button 
                                style={btnStyle} 
                                bg='info' 
                                text="secondary"
                                size='sm' 
                                as={Badge}
                                onClick={e => handle_edit_click(remark)}
                                ref={editRef}
                            >                                
                                <i className="bi bi-pencil"></i>
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={<Popover>
                            <Popover.Body>
                                Delete Remark
                            </Popover.Body>
                        </Popover>}>
                            <Button 
                                style={btnStyle} 
                                bg='danger' 
                                size='sm' 
                                as={Badge}
                                onClick={e => handle_delete_remark(remark)}
                                ref={deleteRef}
                            >                                
                                <i class="bi bi-trash2-fill"></i>
                            </Button>
                        </OverlayTrigger>
                    </>}
                </ButtonGroup>
            </React.Fragment>
        })}
    </>
}

export default Remarks;