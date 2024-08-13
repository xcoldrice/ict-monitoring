import moment, { unix } from 'moment';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useToasts } from "react-toast-notifications";
import { AppContext } from './AppContext';

let weatherStationsLoaded = false;

export const WeatherStationContext = createContext();

const reducer = (weatherStations, action) => {

    let {type, payload} = action;

    switch (type) {
        
        case "load all":

            return payload;

        case "update weather station data":

            let index = weatherStations.findIndex(({ siteId }) => siteId == payload.siteId);

            if (index < 0) {

                return weatherStations;

            }

            weatherStations[index].time = payload.time;

            return weatherStations;

        default:
            break;
        case "set data status":

            return weatherStations.map((ws) => {
                let { offsets } = payload;

                let diff = moment()
                    .diff(moment(ws.time).add((offsets.interval + offsets.threshold), "minutes"), "seconds")
                
                ws.status = "no_data";

                if(!isNaN(diff)) {

                    ws.status = "updated";

                    if(diff > (60 * 60)) {

                        ws.status = "late";

                    }
                }

                return ws;

            });
    }
};


export const WeatherStationProvider = (props) => {

    let { unixNow } = useContext(AppContext)

    let [weatherStations, dispatch] = useReducer(reducer, []);

    let prsds = [ 'NL', 'NCR', 'SL', 'VIS', 'MIN' ];
    
    const { addToast } = useToasts();

    let offsets = {
        arg:{
            interval: 10,
            threshold: 0,
        },
        aws:{
            interval: 10,
            threshold: 0,
        },
        default: {
            interval: 10,
            threshold: 0,
        },
    }

    const getWeatherStations = async () => {
        await axios({ method: "GET", url: "/weather-stations" })
            .then((response) => {

                dispatch({ type: "load all", payload: response.data});

                addToast("Weather Stations Loaded!", { autoDismiss: true, appearance: "success" });

            })
            .catch(() => {

                addToast("Error Loading Weather Stations!", { autoDismiss: true, appearance: "error" });

            });
    };

    useEffect(() => getWeatherStations(), [])

    useEffect(() => {

        if(weatherStations.length > 0 && !weatherStationsLoaded) {

            weatherStationsLoaded = true;

            dispatch({type:"set data status", payload:{ unixNow, offsets }});

        }

    },[weatherStations]);

    useEffect(() => {

        if(weatherStationsLoaded) {

            dispatch({type:"set data status", payload:{ unixNow, offsets }});

        }

    }, [unixNow]);

    useEffect(() => {
        try {

            window.ict_tool_echo.listen("PublishWeatherStation", (event) => {

                dispatch({ type: "update weather station data", payload: event.data });

            });

        } catch (error) {

        }

        return () => {

            window.ict_tool_echo.stopListening("PublishWeatherStation");

        };
    });


    return <>
        <WeatherStationContext.Provider value={{ prsds, weatherStations, offsets }}>
            {props.children}
        </WeatherStationContext.Provider>
    </>
}