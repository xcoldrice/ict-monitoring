import moment from 'moment';
import React from 'react';
import { Badge, Button, OverlayTrigger, Popover } from 'react-bootstrap';

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
        <OverlayTrigger placement='top' overlay={popover}>
            <Button 
                pill
                as={Badge}
                size="sm"
                text="light"
                style={btnStyle} 
                bg={status_ == "active" ? "success":status_ == "down" ? "danger":"info"}
                onClick={e => handle_status_click()}
            >
                {status_ == "active" && <i className="bi bi-check"></i>}
                {status_ == "under_development" && <i className="bi bi-gear-fill"></i>}
                {status_ == "down" && <i className="bi bi-x"></i>}
            </Button>
        </OverlayTrigger>
    </>
}

export default StatusBadge;