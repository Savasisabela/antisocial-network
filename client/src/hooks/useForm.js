import {useState} from "react";

export default function useForm() {
    const [userInput, handleChange] = useState({});

    const handleChange = (e) => setUserInput({
        ...userInput,
        [e.target.input]
    })

    return <div></div>;
}
