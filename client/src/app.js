import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./findpeople";
import OtherProfile from "./otherprofile";

// import { reducer } from "./redux/reducer";

// import { createStore, applyMiddleware } from "redux";
// import * as immutableState from "redux-immutable-state-invariant";
// import { composeWithDevTools } from "redux-devtools-extension";

// const store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(immutableState.default()))
// );

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
        fetch(`/api/user/${this.state.id}`)
            .then((data) => data.json())
            .then((data) => {
                console.log("data in fetch profile", data[0]);
                this.setState({
                    first: data[0].first,
                    last: data[0].last,
                    imageUrl: data[0]["picture_url"],
                    bioText: data[0].bio,
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

    newBioText(val) {
        console.log("val in function", val);
        this.setState({
            bioText: val,
        });
    }

    profileImage(val) {
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
                    {/* <img
                        className="applogo"
                        id="homepage-logo"
                        src="/logo.png"
                        alt="logo"
                    /> */}
                    <div className="logo-header">ANTI</div>
                    <div>
                        <a href="/find-people">Find People</a>
                    </div>
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <ProfilePic
                        uploader={() => this.toggleUploader()}
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                </header>
                <BrowserRouter>
                    <div className="find-people">
                        <Route path="/find-people">
                            <FindPeople />
                        </Route>
                    </div>
                    <div>
                        <Route exact path="/">
                            <Profile
                                uploader={() => this.toggleUploader()}
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bioText={this.state.bioText}
                                newBioText={(val) => this.newBioText(val)}
                            />
                        </Route>
                    </div>
                    <div>
                        <Route exact path="/user/:id">
                            <OtherProfile
                                uploader={() => this.toggleUploader()}
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bioText={this.state.bioText}
                            />
                        </Route>
                    </div>
                </BrowserRouter>
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
