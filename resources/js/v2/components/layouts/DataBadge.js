import moment from 'moment';
import React, { useContext } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { WeatherStationContext } from '../contexts/WeatherStationContext';
let minute = 60;
let hour = 60 * 60;
let day = 60 * 60 * 24;

function DataBadge({text, tooltip, time, interval, threshold}) {

    const {unixNow} = useContext(WeatherStationContext);

    let diff = moment(unixNow).diff(moment(time).add((interval + threshold), 'minutes'), 'seconds');

    const get_badge_color = (d) => {
        if(isNaN(d)) 
            return "light";

        if (d > hour) 
            return "danger";

        if (d > minute && d < hour) 
            return "warning";
        
        return "success";

    }

    const get_text_color = (d) => {

        if(d > minute && d < hour || isNaN(d)) {
            return "secondary";
        }

        return "light";
    }
        
    const get_message = (d) => {

        if(isNaN(d) && d < 0)
            return "";

        if((d > minute && d < hour)) {
            let late_min = Math.floor(d / minute);
            return `${late_min} minute${late_min > 1 ? 's' : ''} late.`;
        }

        if(d > hour && d < day) {
            let late_hour = Math.floor(d / hour);
            return `${late_hour} hour${late_hour > 1 ? 's' : ''} late.`;
        }

        if(d > day) {
            let late_day = Math.floor(d / day);
            return `${late_day} day${late_day > 1 ? 's' : ''} late.`;
        }
    }


    let message = get_message(diff);

    let popover = <Popover style={{ maxWidth: "768px" }}>
        <Popover.Body>
            {tooltip}<br/>
            {message != "" && <b style={{ color:"red" }}>{message}</b>}
        </Popover.Body>
    </Popover>

    return <React.Fragment>
        <OverlayTrigger placement='auto' overlay={popover}>
            <Badge style={{ margin:"0px 2px" }} bg={get_badge_color(diff)} text={get_text_color(diff)}>
                {text}
            </Badge>
        </OverlayTrigger>
    </React.Fragment>
};

export default DataBadge;
