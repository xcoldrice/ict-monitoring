import axios from 'axios';
import React, { createContext, useEffect, useReducer } from 'react';
import { useToasts } from "react-toast-notifications";

export const RadarContext = createContext();

const reducer = (radars, action) => {

    let {type, payload } = action;

    let ix = radars.findIndex((rad) => 
        (rad.name == payload.name && rad.category == payload.category)
    );

    switch(type) {
        case "load all":

            return payload;

        case "update radar data":

            if(radars.length > 0) {
                if(!radars[ix].data[payload.recipient]) {
                    radars[ix].data[payload.recipient] = [payload];
                    return radars;
                }

                let rx = radars[ix].data[payload.recipient].findIndex((dat) => 
                    (dat.type == payload.type)
                );

                rx == -1
                    ? radars[ix].data[payload.recipient].push(payload)
                    : (radars[ix].data[payload.recipient][rx] = payload);
            }

            return radars;

        case "update radar status":

            if(radars[ix]?.status.status == payload.status) {
                radars[ix].status.description = payload.description ?? "";
                radars[ix].status.created_at = payload.created_at;

                return radars;
            }

            let removed = radars.splice(ix, 1)[0];
            
            removed.status.status = payload.status;
            removed.status.created_at = payload.created_at;
            removed.status.description = payload.description ?? "";
            removed.status.created_at = payload.created_at;

            if(removed.status.user == null) {
                removed.status.user = { "name" : payload.user.name }
            }else{
                removed.status.user.name = payload.name;
            } 
        

            let statIndex = radars.map((radar) => {
                if (radar.category != "mosaic") return radar.status.status;
            }).lastIndexOf(payload.status);

            let mosIndex = radars.findIndex((radar) => radar.category == "mosaic");

            if (statIndex < 0) {
                if (payload.status == "active") {
                    radars.unshift(removed);
                    return radars;
                }

                if(payload.status == "warning") {

                    statIndex = mosIndex - 1;
                    
                }

                if (payload.status == "down") {

                    statIndex = mosIndex;

                }

                if (payload.status == "under_development") {
                    
                    statIndex = radars.length;
                
                }

            }

            statIndex = statIndex + 1;

            radars.splice(statIndex, 0, removed);

            return radars;

        case "update network status":
            return radars.map((radar) => {
                if(radar.id == payload.radar_id) {
                    radar.network.status = payload.status;
                    radar.network.description = payload.description;
                }
                return radar;
            });

        case "update work_station status":
            return radars.map((radar) => {
                if(radar.id == payload.radar_id) {
                    radar.work_station.status = payload.status;
                    radar.work_station.description = payload.description;
                }
                return radar;
            });
        case "create radar remarks":

            return radars.map((radar) => {

                if(radar.id == payload.radar_id) {

                    radar.remarks.push(payload);
                    
                }

                return radar;
            });
        case "update radar remarks":
            return radars.map((radar) => {
                if(radar.id == payload.radar_id) {
                    if(payload.type == "update") {
                        let remark = radar.remarks.find((r) => r.id == payload.id);
                        remark.title = payload.title;
                        remark.description = payload.description;
                        remark.priority_level = payload.priority_level;
                        remark.latest_status.action = payload.latest_status.action;
                        remark.latest_status.created_at = payload.latest_status.created_at;
                        remark.latest_status.user.name = payload.latest_status.user.name;
                    }

                    if(payload.type == "delete") {
                        radar.remarks = radar.remarks.filter((r) => r.id != payload.remark_id);
                    }
                }

                return radar;

            });
        default:
            
            return radars;
    }
}

export const RadarProvider = (props) => {
    let recipients = ["dic", "ftp5", "mdsi", "api"];
    let [radars, dispatch] = useReducer(reducer, []);
    let offsets = {
        eec: {
            interval: 10,
            threshold: 10,
        },
        jrc: {
            interval: 15,
            threshold: 0,
        },
        selex: {
            interval: 10,
            threshold: 10,
        },
        vaisala: {
            interval: 10,
            threshold: 10,
        },
        mosaic: {
            interval: 15,
            threshold: 15,
        },
        default: {
            interval: 10,
            threshold: 5,
        },
    };
    let { addToast } = useToasts();

    const getRadars = async () => {
        await axios({method : 'GET', url : '/radars'})
            .then((response) => {

                dispatch({ type: "load all", payload: response.data });

                addToast("Radars loaded!", { autoDismiss: true, appearance: "success" });

            })
            .catch(() => {

                addToast("Error Loading Radars!", { autoDismiss: true, appearance: "error" });

            });
    }

    useEffect(() => getRadars(), []);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("PublishRadar", (event) => {

                dispatch({ type: "update radar data", payload: event.data });

            });
            window.ict_tool_echo.listen("UpdateRadarStatus", (event) => {

                dispatch({ type: `update ${event.data.type} status`, payload: event.data });

                addToast("Radar Status Updated!", { autoDismiss: true, appearance: "success" });

            });

            window.ict_tool_echo.listen("CreateRadarRemark", (event) => {
                dispatch({ type: "create radar remarks", payload: event.data });

                addToast("Added New Radar Remark!", { autoDismiss: true, appearance: "success" });

            });

            window.ict_tool_echo.listen("UpdateRadarRemark", (event) => {
                dispatch({ type: "update radar remarks", payload: event.data });

                addToast("Updated Radar Remark!", { autoDismiss: true, appearance: "success" });

            });

        } catch (error) {
            
        }

        return () => {

            window.ict_tool_echo.stopListening("PublishRadar");

            window.ict_tool_echo.stopListening("UpdateRadarStatus");

            window.ict_tool_echo.stopListening("CreateRadarRemark");

            window.ict_tool_echo.stopListening("UpdateRadarRemark");

        };
    });

    return <>
        <RadarContext.Provider value={{ recipients, radars, offsets }}>
            {props.children}
        </RadarContext.Provider>
    </>
}