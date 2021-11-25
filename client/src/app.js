import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        // this.toggleUploader = this.toggleUploader.bind(this)
    }

    componentDidMount() {
        console.log("App component mounted");
        fetch("/profile.json")
            .then((data) => data.json())
            .then((data) => {
                console.log("data in fetch profile", data[0]);
                this.setState({
                    first: data[0].first,
                    last: data[0].last,
                    imageUrl: data[0]["picture_url"],
                });
            })
            .catch((err) => {
                console.log("error fetching profile from server:", err);
            });
    }

    toggleUploader() {
        console.log("button was clicked");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImage(val) {
        console.log("val in function", val);
        this.setState({
            imageUrl: val,
        });

        setTimeout(() => {
            this.setState({
                uploaderIsVisible: false,
            });
        }, 1000);
    }

    render() {
        return (
            <>
                <header>
                    <img
                        className="applogo"
                        id="homepage-logo"
                        src="/logo.png"
                        alt="logo"
                    />
                    <ProfilePic
                        uploader={() => this.toggleUploader()}
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                </header>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        profileImage={(val) => this.profileImage(val)}
                        uploader={() => this.toggleUploader()}
                    />
                )}
            </>
        );
    }
}
