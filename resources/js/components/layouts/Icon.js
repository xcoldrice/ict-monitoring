import React, { useContext, useEffect} from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';
import Moment from 'react-moment';

const badge_color = (time, now, offset) => {
    let start = new Date(time),
        end = new Date(now),
        diff = end.getTime() - start.getTime();
    
    offset = offset.interval + offset.threshold;

    if(typeof time == 'object') {
        return 'light'
    }
    if (diff > ((60 * 60 * 1000) + offset)) {
        return 'danger';
    }
    if(diff > offset) {
        return 'warning';
    }

    return 'success';
} 

const render_popover = ({file, time, category}) => {
    let text = 'File: ';
    if(category == 'aws' || category == 'arg') {
        text = 'Site: '; 
    }

    return <Popover style={{maxWidth:'500px'}}>
                    <Popover.Body>
                        {text}{file}<br/>
                        {typeof time === 'number'
                            ?<Moment date={time} format="[Date:] MMMM DD, YYYY h:mm A"/>
                            :'No Data...'}<br/>
                        Last Data: <Moment fromNow date={time}/>
                    </Popover.Body>
            </Popover>
}

function Icon(props) {

    let {UNIXNOW, OFFSETS} = useContext(AppContext),
        {time,type,category} = props;

    let offset = OFFSETS[category]?? OFFSETS.default;
    let style = {};
        style.margin = '0px 2px';
    let textColor = 'secondary';
    let badgeColor = 'light';

    if(typeof time === 'number') {
        textColor = 'light';
        badgeColor = badge_color(time, UNIXNOW, offset);
    }

    if(String(type).length < 4 && (category == 'aws' || category == 'arg')) {
        style.width = '43.20px';
    }

    return <>
        <OverlayTrigger placement="auto" overlay={render_popover(props)}>
            <Badge className={props.class} style={style} bg={badgeColor} text={textColor}>
                {type}
            </Badge>
        </OverlayTrigger>
    </>
}

export default Icon;