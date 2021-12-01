import Registration from "./registration";
import Login from "./login";
import Reset from "./reset-password";
import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <section>
                    <div className="hero-container">
                        <div className="environment"></div>
                        <h2 className="hero glitch layers" data-text="ANTI">
                            <span>ANTI</span>
                        </h2>
                    </div>
                </section>
                {/* <img src="/logo.png" alt="logo" /> */}

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
