import Registration from "./registration";
import Login from "./login";
import Reset from "./reset-password";
import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <h1>WELCOME TO</h1>
                <img src="/logo.png" alt="logo" />
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/password/reset">
                        <Reset />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}
