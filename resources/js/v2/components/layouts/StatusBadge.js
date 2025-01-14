import moment from 'moment';
import React, { useRef, useState } from 'react';
import { Badge, Button, OverlayTrigger, Popover } from 'react-bootstrap';

function StatusBadge(props) {
    const [hovered, setHovered] = useState(false);

    let { data, setSelectedRadar, setStatusShow } = props;
    
    let { status, name:radar_name} = data;
        status = props.type == "radar" ? status : data[props.type];
    let status_ = status?.status ?? "under_development";
    
    let btnStyle = { cursor:"pointer"};
    
    const statusRef = useRef();

    const handle_status_click = () => {

        if(window.user_name == "Guest" || radar_name == "mosaic") {

            return;

        }
        console.log(data);
        data.type = props.type;
        
        setSelectedRadar(data);

        setStatusShow(true);

        statusRef.current.blur();

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

    let tdColor = {
        "active" : "#198754",
        "warning" : "#ffc107",
        "down" : "#dc3545",
        "under_development" : "#0dcaf0",
    };


    return <>
        <OverlayTrigger placement='auto' overlay={popover}>
            
            <td 
                style={{ 
                    background: radar_name == "mosaic" ? "aqua" : tdColor[status_],
                    opacity: hovered ? .75 : 1,
                    ...btnStyle
                }}
                onClick={e => handle_status_click()}
                onMouseEnter={e => setHovered(true)}
                onMouseLeave={e => setHovered(false)}
                ref={statusRef}
            >
                    
            </td>
            {/* <Button 
                pill
                as={Badge}
                size="sm"
                text="light"
                style={btnStyle} 
                bg={status_ == "active" ? "success":status_ == "down" ? "danger":"info"}
                onClick={e => handle_status_click()}
                ref={statusRef}
            >
                {status_ == "active" && <i className="bi bi-check"></i>}
                {status_ == "under_development" && <i className="bi bi-gear-fill"></i>}
                {status_ == "down" && <i className="bi bi-x"></i>}
            </Button> */}
        </OverlayTrigger>
    </>
}

export default StatusBadge;