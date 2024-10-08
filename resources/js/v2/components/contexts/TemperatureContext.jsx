import axios from 'axios';
import React, { createContext, useEffect, useReducer } from 'react';
import { useToasts } from "react-toast-notifications";

export const TemperatureContext = createContext();

const reducer = (temperatures, action) => {
    switch (action.type) {
        case "load all temperatures":
            return action.payload;
        case "update temperature":
            let ix = temperatures.findIndex(t => t.room == action.payload.room);
            temperatures[ix] = action.payload;
            return temperatures;
        default:
            break;
    }
}

export const TemperatureProvider = (props) => {
    let [temperatures, dispatch] = useReducer(reducer, []);

    let { addToast } = useToasts();

    const getTemperatures = async () => {
        await axios({ method:"GET", url:"/temperatures"})
            .then((response) => {
                dispatch({type:"load all temperatures", payload:Object.values(response.data)})

                addToast("Temperatures Loaded!", {
                    appearance: "success",
                    autoDismiss: true,
                });
            })
            .catch(() => {
                addToast("Error Loading Temperatures!", {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }

    useEffect(() => getTemperatures(), []);

    useEffect(() => {
        try{
            window.ict_tool_echo.listen("PublishTemperature", (event) => {
                dispatch({type:"update temperature", payload:event.data});
            })
        } catch (error) {

        }

        return () => {
            return window.ict_tool_echo.stopListening('PublishTemperature');
        }

    });


    return <>
        <TemperatureContext.Provider value={{ temperatures }}>
            {props.children}
        </TemperatureContext.Provider>
    </>
}