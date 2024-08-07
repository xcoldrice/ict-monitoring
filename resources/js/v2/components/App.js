import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from "react-dom";
import { ToastProvider } from "react-toast-notifications";
import { AppProvider } from "./contexts/AppContext";
import Menu from "./layouts/Menu";

function App() {
    return <>
        <ToastProvider>
            <AppProvider>
                <Menu />
            </AppProvider>
        </ToastProvider>
    </>
}

export default App;

document.getElementById("root") && ReactDOM.render(<App/>, document.getElementById("root"));
