import moment from "moment";
import React, { useContext } from "react";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import Moment from "react-moment";
import { AppContext } from "./../contexts/AppContext";

function Icon(props) {
    let { children, tooltip, time, class: className, category, style } = props,
        { UNIXNOW, OFFSETS } = useContext(AppContext),
        { interval, threshold } = OFFSETS[category] ?? OFFSETS.default,
        offset = interval,
        dataTime = "No Data.",
        timeDiff = "",
        textColor = "secondary",
        fileInterval = `Interval: ${offset / 1000 / 60} minutes.`;

    if (typeof time === "number") {
        dataTime = <Moment date={time} format="[Date:] MMMM DD, YYYY h:mm A" />;
        textColor = "light";
        let diffMin = moment().diff(time + offset, "minutes");
        if (diffMin > 0 && diffMin < 60) {
            timeDiff = `${diffMin} minutes late.`;
        }
        if (diffMin > 60 && diffMin < 1440) {
            timeDiff = `${Math.floor(diffMin / 60)} hours late.`;
        }
        if (diffMin > 1440) {
            timeDiff = `${Math.floor(diffMin / 1440)} days late.`;
        }
    }
    const badge_color = () => {
        let diff = new Date(UNIXNOW).getTime() - new Date(time).getTime();

        if (typeof time == "object") return "light";

        if (diff > 60 * 60 * 1000 + offset) return "danger";

        if (diff > offset) return "warning";

        return "success";
    };

    const render_popover = () => {
        return (
            <Popover style={{ maxWidth: "768px" }}>
                <Popover.Body>
                    {tooltip} <br />
                    {dataTime} <br />
                    {fileInterval} <br />
                    {timeDiff}
                </Popover.Body>
            </Popover>
        );
    };

    return (
        <OverlayTrigger placement="auto" overlay={render_popover()}>
            <Badge
                style={{ ...style, margin: "0px 2px" }}
                className={className}
                bg={badge_color()}
                text={textColor}
            >
                {children}
            </Badge>
        </OverlayTrigger>
    );
}

export default Icon;
