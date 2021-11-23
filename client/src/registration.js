import React from "react";

export default class Registration extends React.Component {
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
        fetch("/registration.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                first: this.state.first,
                last: this.state.last,
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
            <div>
                <h3>Sign Up!</h3>
                {this.state.error && <div className="error">Oops!</div>}
                <input
                    name="first"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="insert your first name"
                />
                <input
                    name="last"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="insert your last name"
                />
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
            </div>
        );
    }
}
