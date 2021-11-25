import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        fetch("/login.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState(
                        {
                            error: true,
                        },
                        () => console.log(this.state)
                    );
                }
            });
    }

    render() {
        return (
            <>
                <h3>Login</h3>
                {this.state.error && <div className="error">Oops!</div>}
                <input
                    type="email"
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="insert your email"
                />
                <input
                    type="password"
                    name="password"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="insert your password"
                />
                <button onClick={() => this.submit()}>Submit</button>
                <Link to="/">Click here to register</Link>
                <Link to="/password/reset">Forgot your password?</Link>
            </>
        );
    }
}
