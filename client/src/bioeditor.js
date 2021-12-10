import { useState, useEffect } from "react";

export default function BioEditor({ bioText, newBioText }) {
    console.log("bioText before", bioText);
    const [editor, setEditor] = useState(false);
    const [bio, setBio] = useState(bioText);

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

    const handleChange = (e) => setBio(e.target.value);

    // const changeBio = () => setBio(draftBio);

    return (
        <div>
            {!editor && <div className="bio-text">{bioText}</div>}

            {editor && (
                <div className="bio-edit">
                    <textarea
                        onChange={(e) => handleChange(e)}
                        defaultValue={bioText}
                    />
                </div>
            )}

            <div>
                <button
                    onClick={() => {
                        textareaToggle();
                        // changeBio();
                        {
                            editor && uploadBio();
                        }
                    }}
                >
                    {!bioText && !editor && "Add Bio"}
                    {bioText && !editor && "Edit Bio"}
                    {editor && "Save"}
                </button>
            </div>
        </div>
    );
}
