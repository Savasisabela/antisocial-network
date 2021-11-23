import Greetee from "./greetee";

export function HelloWorld() {
    const myElem = <h1>I love JSX {5 * 8}</h1>;
    const name = "Isabela";
    return (
        <>
            {myElem}
            <h2> Hello, Poppy! {1 + 1} </h2>
            <h2 className="thatshowyoucallclasshere">
                Hello {name.toUpperCase()}
            </h2>
            <Greetee name="Poppy" sweet="🥞" />
            <Greetee name={name} />
            <Greetee />
        </>
    );
}
