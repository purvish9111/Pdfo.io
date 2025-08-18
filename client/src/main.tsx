import { createRoot } from "react-dom/client";
import App from "./App";
import MinimalApp from "./MinimalApp";
import "./index.css";

// Temporarily use MinimalApp to test React loading
createRoot(document.getElementById("root")!).render(<MinimalApp />);
