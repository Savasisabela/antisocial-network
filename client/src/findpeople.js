import { useState, useEffect } from "react";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch(`/newusers`)
            .then((res) => res.json())
            .then((result) => {
                console.log("users: ", result);
                setUsers(result);
            })
            .catch(console.log);
        return () => {
            console.log(`Is this loading again?`);
        };
    }, []);

    useEffect(() => {
        fetch(`/finduser/${searchTerm}`)
            .then((res) => res.json())
            .then((result) => {
                console.log("users: ", result);
                setUsers(result);
            })
            .catch(console.log);
        return () => {
            console.log(`About to replace ${searchTerm} with a new value`);
        };
    }, [searchTerm]);

    const updateUsersList = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <p>Find People</p>
            <input type="text" onChange={updateUsersList} />
            <div className="users-result-container">
                {users?.map((user) => (
                    <div key={user.id} className="users-result">
                        <img src={user["picture_url"]} />
                        <p>
                            {user.first} {user.last}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
