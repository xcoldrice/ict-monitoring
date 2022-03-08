import React, {createContext,useEffect,useState} from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { RadarProvider } from './RadarContext';
export const AppContext = createContext();

export const AppProvider = (props) => {
    
    let [UNIXNOW,setUNIXNOW] = useState(Date.now());

    const auto_refresh = () => {
        setTimeout(() => setUNIXNOW(Date.now()) , 5000);
    }

    useEffect(() => auto_refresh() , [UNIXNOW]);

    useEffect(()=>{
            let echo = new Echo({
                broadcaster: 'pusher',
                key: process.env.MIX_PUSHER_APP_KEY,
                cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                forceTLS: false,
                wsHost: window.location.hostname,
                wsPort: 6001,
                disableStats: true,
                enabledTransports: ['ws', 'wss'] // <- added this param
            });
            window.ict_tool_echo = echo.channel('ict-tool-channel');

    },[])


    return (

        <AppContext.Provider value={{UNIXNOW}}>
            <RadarProvider>
                {props.children}
            </RadarProvider>
        </AppContext.Provider>
    );
}


