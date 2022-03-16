import React, {createContext,useEffect,useState} from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { RadarProvider } from './RadarContext';
import { WeatherStationProvider } from './WeatherStationContext';
export const AppContext = createContext();

export const AppProvider = (props) => {
    
    let [UNIXNOW,setUNIXNOW] = useState(Date.now());
    const OFFSETS = {
                            'eec' : {
                                'interval' : 10 * 60 * 1000,
                                'threshold' : 5 * 60 * 1000,
                            },
                            'jrc' : {
                                'interval' : 15 * 60 * 1000,
                                'threshold' : 5 * 60 * 1000,
                            },
                            'selex' : {
                                'interval' : 10 * 60 * 1000,
                                'threshold' : 5 * 60 * 1000,
                            },
                            'vaisala' : {
                                'interval' : 10 * 60 * 1000,
                                'threshold' : 5 * 60 * 1000,
                            },
                            'mosaic' : {
                                'interval' : 15 * 60 * 1000,
                                'threshold' : 10 * 60 * 1000,
                            },
                            'default' : {
                                'interval' : 10 * 60 * 1000,
                                'threshold' : 5 * 60 * 1000,
                            }
    };
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
                wssHost: window.location.hostname,
                wssPort: 6001,
                disableStats: true,
                enabledTransports: ['ws', 'wss'] // <- added this param
            });
            window.ict_tool_echo = echo.channel('ict-tool-channel');
    },[])


    return (

        <AppContext.Provider value={{UNIXNOW,OFFSETS}}>
            <RadarProvider>
                <WeatherStationProvider>
                    {props.children}
                </WeatherStationProvider>
            </RadarProvider>
        </AppContext.Provider>
    );
}


