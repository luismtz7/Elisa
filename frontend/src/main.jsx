import React from "react";
import ReactDOM from "react-dom/client"; // Importa ReactDOM correctamente
import App from "./App";
import { AuthProvider } from "../src/authContext/authContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
