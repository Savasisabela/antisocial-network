import { useState, useEffect } from "react";

export default function FriendBtn({ otherId }) {
    const [btnText, setBtnText] = useState();
    // friendBtn should be passed the other userId of the otherProfile on which this btn will be rendered.
    // we need this info to figure out what the btn should read.

    // LOGIC I:
    //we'll want to add a useEffect to make a request to the server to find out our relationship status with the user we are looking at.
    //as a result of this fetch our btn should display the correct txt.

    useEffect(() => {
        console.log("friend id on client button mount:", otherId);
        fetch(`/api/friendship/${otherId}`)
            .then((res) => res.json())
            .then(({ friendship, reqSent, reqReceived, problem }) => {
                console.log("friendship", friendship);
                console.log("reqSent", reqSent);
                console.log("reqReceived", reqReceived);

                if (!friendship && !reqReceived && !reqSent) {
                    return setBtnText("Send Friend Request");
                }
                if (reqSent) {
                    return setBtnText("Cancel Friend Request");
                }
                if (reqReceived) {
                    return setBtnText("Accept Friend Request");
                }
                if (friendship) {
                    return setBtnText("Unfriend");
                }
                if (problem) {
                    return setBtnText("PROBLEM on mount");
                }
            })
            .catch((err) =>
                console.log(
                    "error fetching friend status on mounting button:",
                    err
                )
            );
    }, []);

    //LOGIC II:
    //when the btn gets clicked we need to update the relationship in the database and update the btn text to reflect this change.

    const handleClick = () => {
        console.log("button clicked");
        fetch(`/api/friendship`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                btnText: btnText,
                otherId: otherId,
            }),
        })
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log("RECEIVED DATA after post friendship", data);
                if (data.reqSent) {
                    return setBtnText("Cancel Friend Request");
                }
                if (data.accepted) {
                    return setBtnText("Unfriend");
                }
                if (data.canceled) {
                    return setBtnText("Send Friend Request");
                }
                if (data.problem) {
                    return setBtnText("PROBLEM on change status");
                }
            })

            .catch((err) => {
                console.log("error on post friendship:", err);
            });
    };

    return (
        <div>
            <button onClick={handleClick}>{btnText}</button>
        </div>
    );
}
