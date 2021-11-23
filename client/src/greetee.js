function Greetee(props) {
    console.log("props:", props);
    return <h1>Hello {props.name || "😎"}</h1>;
}

export default Greetee;
