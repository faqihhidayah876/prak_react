import { createRoot } from "react-dom/client";
import './tailwind.css';
import FrameworkList from "./components/FrameworkList";
import FrameworkListSearchFilter from "./components/FramewrokListSeacrhFilter";
import ResponsiveText from "./ResponsiveDesign";


createRoot(document.getElementById("root"))
    .render(
        <div>
            {/* <FrameworkListSearchFilter/> */}
            <ResponsiveText/>
        </div>
    )