import Echo from "laravel-echo";
import moment from "moment";
import Pusher from "pusher-js";
import React, { createContext, useEffect, useState } from 'react';
import { RadarProvider } from "./RadarContext";
import { WeatherStationProvider } from "./WeatherStationContext";

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [unixNow, setUnixNow] = useState(moment.now());
    
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
            enabledTransports: ["ws", "wss"],
        });
        window.ict_tool_echo = echo.channel("ict-tool-channel");
    }, []);

    useEffect(() => {
        let unixNowTimeout = setTimeout(() => {
            setUnixNow(moment.now());
        }, 3000);

        return () => {
            clearInterval(unixNowTimeout);
        }
    }, [unixNow]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("TriggerReload", () => {
                window.location.href = window.location.href.replace(/#.*$/, "");
                // document.location.reload(true);
            });
        } catch (error) {}
    });

    return <>
        <AppContext.Provider value={{ unixNow }}>
            <RadarProvider>
                <WeatherStationProvider>
                    {props.children}
                </WeatherStationProvider>
            </RadarProvider>
        </AppContext.Provider>
    </>
}