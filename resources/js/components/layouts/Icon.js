import React, {useContext} from 'react';
import { Badge,  OverlayTrigger, Popover } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';
import Moment from 'react-moment';

function Icon(props) {
    let {children, tooltip, time, class:className, category, style}= props,
        {UNIXNOW, OFFSETS} = useContext(AppContext),
        {interval, threshold} = OFFSETS[category]?? OFFSETS.default,
        dataTime = 'No Data.',
        timeDiff = '',
        textColor = 'secondary';

    if(typeof time === 'number') {
        dataTime = <Moment date={time} format="[Date:] MMMM DD, YYYY h:mm A"/>;
        timeDiff = <Moment fromNow date={time}/>;
        textColor = 'light';
    }


    const badge_color = () => {

        let diff = ((new Date(UNIXNOW).getTime()) - (new Date(time).getTime())),
            offset = interval + threshold;
    
        if(typeof time == 'object') 
            return 'light';
    
        if(diff > ((60 * 60 * 1000) + offset)) 
            return 'danger';
    
        if(diff > offset) 
            return 'warning';
    
        return 'success';

    }

    const render_popover = () => {

        return <Popover style={{maxWidth:'600px'}}>
                <Popover.Body>
                    {tooltip} <br/>
                    {dataTime} <br/>
                    {timeDiff}
                </Popover.Body>
            </Popover>
    }

    return <>
        <OverlayTrigger placement="auto" overlay={render_popover()}>
            <Badge 
                style={{...style, margin:"0px 2px"}}
                className={className}
                bg={badge_color()} 
                text={textColor}
            >
                {children}
            </Badge>
        </OverlayTrigger>
    </> 
}

export default Icon;