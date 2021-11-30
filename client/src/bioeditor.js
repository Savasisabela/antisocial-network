import { useState, useEffect } from "react";

export default function BioEditor({ bioText, newBioText }) {
    const [editor, setEditor] = useState(false);
    const [bio, setBio] = useState(bioText);

    useEffect(() => {
        setBio(bioText);
    }, [bioText]);

    const uploadBio = () => {
        console.log("amiga deu certo");
        fetch("/bio/upload", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                bio: bio,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("SUCCESS uploading bio");
                    newBioText(bio);
                } else {
                    console.log("PROBLEM uploading bio");
                }
            });
    };

    const textareaToggle = () => setEditor(!editor);

    const handleChange = (e) => setBio(e.target.value); // maybe reconsider for a cancel button (keeep the value in a draft)

    return (
        <div>
            {!editor && <div className="bio-text">{bio}</div>}

            {editor && (
                <div className="bio-edit">
                    <textarea
                        onChange={(e) => handleChange(e)}
                        defaultValue={bio}
                    />
                </div>
            )}

            <div>
                <button
                    onClick={() => {
                        textareaToggle();
                        {
                            editor && uploadBio();
                        }
                    }}
                >
                    {!bio && !editor && "Add Bio"}
                    {bio && !editor && "Edit Bio"}
                    {editor && "Save"}
                </button>
            </div>
        </div>
    );
}
