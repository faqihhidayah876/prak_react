import { createRoot } from "react-dom/client";
import './tailwind.css';
import FrameworkList from "./components/FrameworkList";
import FrameworkListSearchFilter from "./components/FramewrokListSeacrhFilter";


createRoot(document.getElementById("root"))
    .render(
        <div>
            <FrameworkListSearchFilter/>
        </div>
    )