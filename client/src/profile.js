import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, imageUrl, bioText, uploader }) {
    console.log("bioText in Profile component", bioText);
    console.log("imageUrl in Profile component", imageUrl);
    return (
        <div className="profile-container">
            <div>
                <div className="profileimage">
                    <ProfilePic imageUrl={imageUrl} uploader={uploader} />
                </div>
                <div className="profile-name">
                    <p>
                        {first} {last}
                    </p>
                </div>
            </div>

            <BioEditor bioText={bioText} />
        </div>
    );
}
