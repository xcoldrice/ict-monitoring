import Echo from "laravel-echo";
import Pusher from "pusher-js";
import React, { createContext, useEffect, useState } from "react";
import { ToastProvider } from "react-toast-notifications";
import { RadarProvider } from "./RadarContext";
import { WeatherStationProvider } from "./WeatherStationContext";

export const AppContext = createContext();

export const ACTIONS = {
    RADAR_DATA_UPDATE: "radar-data-update",
    RADAR_STATUS_UPDATE: "radar-status-update",
    RADAR_LOAD_ALL: "radar-load-all",
    WEATHER_STATION_LOAD_ALL: "weather-station-load-all",
    UPDATE_STATION_DATA: "update-station-data",
    MODEL_LOAD_ALL: "model-load-all",
    MODEL_ADD: "model-add",
    MODEL_UPDATE: "model-update",
    MODEL_DELETE: "model-delete",
    MODEL_STATUS_UPDATE: "model-status-update",
    ALERT: "alert-modal-open",
};

export const AppProvider = (props) => {
    let [UNIXNOW, setUNIXNOW] = useState(Date.now());
    let ten_min = 10 * 60 * 1000,
        fifteen_min = 15 * 60 * 1000,
        five_min = 5 * 60 * 1000;

    const OFFSETS = {
        eec: {
            interval: ten_min,
            threshold: five_min,
        },
        jrc: {
            interval: fifteen_min,
            threshold: five_min,
        },
        selex: {
            interval: ten_min,
            threshold: five_min,
        },
        vaisala: {
            interval: ten_min,
            threshold: five_min,
        },
        mosaic: {
            interval: fifteen_min,
            threshold: ten_min,
        },
        aws: {
            interval: ten_min,
            threshold: ten_min,
        },
        arg: {
            interval: ten_min,
            threshold: ten_min,
        },
        default: {
            interval: ten_min,
            threshold: five_min,
        },
    };
    const auto_refresh = () => {
        setTimeout(() => setUNIXNOW(Date.now()), 5000);
    };

    useEffect(() => auto_refresh(), [UNIXNOW]);

    useEffect(() => {
        let echo = new Echo({
            broadcaster: "pusher",
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: false,
            wsHost: window.location.hostname,
            wsPort: 6001,
            wssHost: window.location.hostname,
            wssPort: 6001,
            disableStats: true,
            enabledTransports: ["ws", "wss"], // <- added this param
        });

        window.ict_tool_echo = echo.channel("ict-tool-channel");
    }, []);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("TriggerReload", () => {
                window.location.href = window.location.href.replace(/#.*$/, "");
                // document.location.reload(true);
            });
        } catch (error) {}
    });

    return (
        <ToastProvider>
            <AppContext.Provider value={{ UNIXNOW, OFFSETS }}>
                <RadarProvider>
                    <WeatherStationProvider>
                        {props.children}
                    </WeatherStationProvider>
                </RadarProvider>
            </AppContext.Provider>
        </ToastProvider>
    );
};
