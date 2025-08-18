import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Use SimpleApp to avoid React hooks issues
import SimpleApp from "./SimpleApp";
createRoot(document.getElementById("root")!).render(<SimpleApp />);
