import React, {createContext,useEffect,useState} from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { RadarProvider } from './RadarContext';
import { WeatherStationProvider } from './WeatherStationContext';
export const AppContext = createContext();

export const AppProvider = (props) => {
    
    let [UNIXNOW,setUNIXNOW] = useState(Date.now());

    let ten_min = ten_min;
    let fifteen_min = fifteen_min;
    let five_min = five_min;


    const OFFSETS = {
                            'eec' : {
                                'interval' : ten_min,
                                'threshold' : five_min,
                            },
                            'jrc' : {
                                'interval' : fifteen_min,
                                'threshold' : five_min,
                            },
                            'selex' : {
                                'interval' : ten_min,
                                'threshold' : five_min,
                            },
                            'vaisala' : {
                                'interval' : ten_min,
                                'threshold' : five_min,
                            },
                            'mosaic' : {
                                'interval' : fifteen_min,
                                'threshold' : ten_min,
                            },
                            'aws' : {
                                'interval' : ten_min,
                                'threshold' : ten_min,
                            },
                            'arg' : {
                                'interval' : ten_min,
                                'threshold' : ten_min,
                            },
                            'default' : {
                                'interval' : ten_min,
                                'threshold' : five_min,
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


