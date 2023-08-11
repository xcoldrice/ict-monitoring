import React, { createContext, useEffect, useReducer } from 'react';
import { useToasts } from 'react-toast-notifications';

export const TemperatureContext = createContext();

const reducer = (temperatures, actions) => {
    switch (actions.type) {
        case 'LOAD':
            return actions.payload;
        case 'UPDATE':
            let tmp = [...temperatures];
            let index = tmp.findIndex(t => t.room == actions.payload.room);
            tmp[index] = actions.payload;
            return tmp;                
        default:
            break;
    }

}


export const TemperatureProvider = (props) => {

    let [temperatures, dispatch] = useReducer(reducer, []);

    let { addToast } = useToasts();


    const getTemperatures = async () => {
        await axios({ method: "GET", url: "/temperatures" })
        .then((response) => {
            dispatch({
                type:'LOAD',
                payload:Object.values(response.data)
            });

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
        });
    }

    useEffect(() => getTemperatures(), [])


    useEffect(() => {
        try {
            window.ict_tool_echo.listen("PublishTemperature", (event) => {
                dispatch({
                    type:'UPDATE',
                    payload:event.data
                });
            });
        } catch (error) {}
        return () => {
            window.ict_tool_echo.stopListening("PublishTemperature");
        };
    });

    return <TemperatureContext.Provider value={{temperatures}}>
        {props.children}
    </TemperatureContext.Provider>
}

