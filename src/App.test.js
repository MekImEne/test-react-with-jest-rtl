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

//A warning act(..) is thrown because the state is set after the test block finishes rendering the component.

// async tells Jest that asynchronous code runs as a result of the API call that occurs when the component mounts.
test("initial render in the landing page", async () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");
  //fix the warning
  expect(await screen.findByRole("option", { name: "husky"})).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
