import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { HelloWorld } from "./helloWorld";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img src="/logo.gif" alt="logo" />,
                document.querySelector("main")
            );
        }
    });
