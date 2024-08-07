import moment from 'moment';
import React from 'react';
import { Badge, Button, ButtonGroup, OverlayTrigger, Popover } from 'react-bootstrap';

function StatusBadge(props) {

    let { data, setSelectedRadar, setStatusShow } = props;

    let { status, name:radar_name} = data;

    let status_ = status?.status ?? "under_development";

    let btnStyle = { border:"0", cursor:"pointer"};


    const handle_status_click = () => {

        if(window.user_name == "Guest" || radar_name == "mosaic") {

            return;

        }

        setSelectedRadar(data);

        setStatusShow(true);

    }

    let popover = <Popover style={{ maxWidth: "768px" }}>
        <Popover.Body>
            {radar_name == "mosaic" && "MOSAIC"}
            {radar_name != "mosaic" && <>
                Status : {status_}<br/>
                {status.description && <> 
                    Description : {status.description}<br/>
                </>}
                Datetime : {moment(status.created_at).format("LLL")}<br/>
                By : {status.user?.name ?? "admin"}<br/>
            </>}
        </Popover.Body>
    </Popover>

    return <>
        <ButtonGroup style={{ ...btnStyle, margin:"0px 2px" }}>
            <OverlayTrigger placement='top' overlay={popover}>
                <Button 
                    as={Badge}
                    size="sm"
                    text="light"
                    style={btnStyle} 
                    bg={status_ == "active" ? "success":status_ == "down" ? "danger":"info"}
                >
                    {status_}
                </Button>
            </OverlayTrigger>
            {window.user_name != "Guest" && radar_name != "mosaic" && <>
                <OverlayTrigger 
                    placement='top' 
                    overlay={
                        <Popover>
                            <Popover.Body>
                                Update Status
                            </Popover.Body>
                        </Popover>
                }>
                    <Button 
                        style={btnStyle} 
                        bg='info' 
                        text="secondary"
                        size='sm' 
                        as={Badge}
                        onClick={e => handle_status_click()}
                    >                                
                        <i className="bi bi-pencil"></i>
                    </Button>
                </OverlayTrigger>
            </>}
        </ButtonGroup>

    </>
}

export default StatusBadge;