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
        // Make a fetch request to get datafor currently logged in user
    }

    toggleUploader() {
        console.log("button was clicked");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
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
                        first="Isabela"
                        last="Savastano"
                        imageUrl=""
                    />
                </header>

                {this.state.uploaderIsVisible && (
                    <Uploader uploader={() => this.toggleUploader()} />
                )}
            </>
        );
    }
}
