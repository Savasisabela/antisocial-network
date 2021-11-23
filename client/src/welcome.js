import Registration from "./registration";

export default function Welcome() {
    const myElem = <h1>WELCOME</h1>;

    return (
        <>
            {myElem}
            <Registration></Registration>
        </>
    );
}
