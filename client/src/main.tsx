import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Use SimpleApp to avoid React hooks errors
createRoot(document.getElementById("root")!).render(<SimpleApp />);
