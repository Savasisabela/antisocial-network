import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigFile: false,
            imgUploaded: false,
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
                    console.log(
                        "RECEIVED DATA after uploading",
                        data["picture_url"]
                    );
                    this.setState({
                        bigFile: false,
                        imgUploaded: true,
                    });
                    this.props.profileImage(data["picture_url"]);
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
                        <button onClick={() => this.props.uploader()}>X</button>
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
                            {this.state.imgUploaded && (
                                <p>
                                    <strong>
                                        Your image was successfully uploaded!
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
