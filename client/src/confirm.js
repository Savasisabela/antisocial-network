import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

export default class Confirm extends Component {
    goOn() {}

    render() {
        return (
            <>
                <BrowserRouter>
                    <img src="/clear.png" alt="confirmation" />
                    <button onClick={() => this.goOn()}>yes</button>
                    <button>lame</button>
                </BrowserRouter>
            </>
        );
    }
}
