import { useParams, useHistory } from "react-router";
import { useEffect, useState } from "react";

export default function OtherProfile() {
    const { id } = useParams();
    const history = useHistory();
    console.log("history:", history);

    const [user, setUser] = useState({});

    useEffect(() => {
        // fetch the (other) user's data
        // if own id, make the server send this info and redirect to profile on client side
        fetch(`/api/user/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.ownId) {
                    return history.replace("/");
                } else if (result.noId) {
                    return history.replace("/404"); // make this page later
                }
                return setUser(result[0]);
            })
            .catch(console.log);
    }, [id]);

    const { picture_url, first, last, bio } = user;
    return (
        <div className="profile-container">
            <div>
                <img src={picture_url} />
                <div className="profile-name">
                    <p>
                        {first} {last}
                    </p>
                </div>
            </div>
            <div>{bio}</div>
        </div>
    );
}
