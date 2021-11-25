import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigFile: false,
        };
    }

    upload() {
        const formData = new FormData();
        formData.append("file", this.state.file);
        console.log("formData", formData);

        fetch("/profile/upload", {
            method: "POST",
            body: formData,
        })
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                if (data.fileTooBig) {
                    this.setState({ bigFile: true });
                } else {
                    this.images.unshift(data); // update this line!!!!!!
                    this.setState({ bigFile: false });
                }
            })

            .catch((err) => {
                console.log("error fetching uploaded images from server:", err);
            });
    }

    setFile(e) {
        console.log("e.target.files[0]", e.target.files[0]);
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("file in setFile:", this.state.file)
        );
    }

    render() {
        return (
            <>
                <div className="popup-uploader-bg">
                    <div className="popup-uploader">
                        <input
                            name="file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => this.setFile(e)}
                        />
                        <button onClick={() => this.upload()}>Upload</button>
                        <div className="big-file">
                            {this.state.bigFile && (
                                <p>
                                    <strong>
                                        File must be smaller than 2Mb
                                    </strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
