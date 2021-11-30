import BioEditor from "./bioeditor";
import { render } from "@testing-library/react";

// const mockBio = jest.fn();

test("When no bio is passed to it, an 'Add' button is rendered", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toBe("Add Bio");
});

test("When a bio is passed to it, an 'Edit' button is rendered.", () => {
    const { container } = render(<BioEditor bioText={"something"} />);

    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});
