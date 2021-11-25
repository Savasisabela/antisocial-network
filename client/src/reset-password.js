import { Component } from "react";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 1,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit1() {
        fetch("/password/getcode", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                this.setState(
                    {
                        stage: 2,
                    },
                    () => console.log(this.state)
                );
            });
    }

    submit2() {
        fetch("/password/reset", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                code: this.state.code,
                password: this.state.password,
                email: this.state.email,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    this.setState(
                        {
                            stage: 3,
                        },
                        () => console.log(this.state)
                    );
                } else {
                    this.setState(
                        {
                            error: true,
                        },
                        () => console.log("error", this.state)
                    );
                }
            });
    }

    showStage() {
        if (this.state.stage === 1) {
            return (
                <>
                    <h3>Step one:</h3>
                    <input
                        type="email"
                        key="email"
                        name="email"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="insert your email"
                    />
                    <button onClick={() => this.submit1()}>Submit</button>
                </>
            );
        } else if (this.state.stage === 2) {
            return (
                <>
                    <h3>Step two:</h3>
                    <input
                        name="code"
                        key="code"
                        minLength="6"
                        maxLength="6"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="insert your six digit code"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => this.handleChange(e)}
                        placeholder="insert your new password"
                    />
                    {this.state.error && (
                        <div className="error">
                            Some problem occured, please try again
                        </div>
                    )}
                    <button onClick={() => this.submit2()}>Submit</button>
                </>
            );
        } else if (this.state.stage === 3) {
            return (
                <>
                    <h3>Success!</h3>
                    <p>Your password was successfully changed.</p>
                    <Link to="/login">Click here to login</Link>
                </>
            );
        }
    }

    render() {
        return (
            <div>
                <h2>Reset password</h2>
                {this.showStage()}
            </div>
        );
    }
}
