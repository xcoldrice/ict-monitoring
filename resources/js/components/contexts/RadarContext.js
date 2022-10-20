import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { ACTIONS } from "./AppContext";

export const RadarContext = createContext();

const reducer = (radars, action) => {
    let payload = action.payload,
        {
            status,
            category,
            name,
            remarks,
            type,
            recipient,
            posted_by,
            date_posted,
        } = payload,
        index = radars.findIndex(
            (radar) => radar.name == name && radar.category == category
        );

    switch (action.type) {
        case ACTIONS.RADAR_DATA_UPDATE:
            if (!radars[index].data[recipient]) {
                radars[index].data[recipient] = [payload];
                return radars;
            }

            let x = radars[index].data[recipient].findIndex(
                (data) => data.type == type
            );
            x == -1
                ? radars[index].data[recipient].push(payload)
                : (radars[index].data[recipient][x] = payload);

            return radars;

        case ACTIONS.RADAR_STATUS_UPDATE:
            if (radars[index].status == status) {
                radars[index].remarks = remarks ?? "";
                return radars;
            }

            let removed = radars.splice(index, 1)[0];
            removed.status = status;
            removed.remarks = remarks ?? "";
            removed.posted_by = posted_by;
            removed.date_posted = date_posted;

            let statIndex = radars
                .map((radar) => {
                    if (radar.category != "mosaic") return radar.status;
                })
                .lastIndexOf(status);

            let mosIndex = radars.findIndex(
                (radar) => radar.category == "mosaic"
            );

            if (statIndex < 0) {
                if (status == 1) {
                    radars.unshift(removed);

                    return radars;
                }

                if (status == 3 && mosIndex > 0) statIndex = mosIndex - 1;

                if (status == 0) statIndex = mosIndex;

                if (status == 2) statIndex = radars.length;
            }

            statIndex = statIndex + 1;

            radars.splice(statIndex, 0, removed);

            return radars;

        case ACTIONS.RADAR_LOAD_ALL:
            return payload;
        default:
            return radars;
    }
};

export const RadarProvider = (props) => {
    let recipients = ["dic", "ftp5", "mdsi", "api"];

    let [radars, dispatch] = useReducer(reducer, []);

    let { addToast } = useToasts();

    const getRadars = async () => {
        await axios({ method: "GET", url: "/radars" })
            .then((response) => {
                dispatch({
                    type: ACTIONS.RADAR_LOAD_ALL,
                    payload: response.data,
                });

                addToast("Radars loaded!", {
                    autoDismiss: true,
                    appearance: "success",
                });
            })
            .catch(() => {
                addToast("Error Loading Radars!", {
                    appearance: "error",
                    autoDismiss: true,
                });
            });
    };

    useEffect(() => getRadars(), []);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("PublishRadar", (event) => {
                dispatch({
                    type: ACTIONS.RADAR_DATA_UPDATE,
                    payload: event.data,
                });
            });
            window.ict_tool_echo.listen("UpdateRadarStatus", (event) => {
                dispatch({
                    type: ACTIONS.RADAR_STATUS_UPDATE,
                    payload: event.data,
                });

                addToast("Radar Status Updated!", {
                    autoDismiss: true,
                    appearance: "success",
                });
            });
        } catch (error) {}
        return () => {
            window.ict_tool_echo.stopListening("PublishRadar");
            window.ict_tool_echo.stopListening("UpdateRadarStatus");
        };
    });

    return (
        <RadarContext.Provider value={{ radars, recipients, dispatch }}>
            {props.children}
        </RadarContext.Provider>
    );
};
