import { render, screen } from "@testing-library/react";
import mockFetch from "./mocks/mockFetch";
import App from "./App";

beforeEach(() => {
  //creates a mock function that will track calls to the fetch method 
  //attached to the global window variable in the DOM.
  jest.spyOn(window, "fetch").mockImplementation(mockFetch); //use func mockFetch to implement the mock method
})

afterEach(() => {
  jest.restoreAllMocks()
});


test("initial render in the landing page", () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
