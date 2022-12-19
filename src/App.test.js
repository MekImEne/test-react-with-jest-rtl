import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; 
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

// async tells Jest that asynchronous code runs as a result of the API call that occurs 
//when the component mounts.
test("initial render in the landing page", async () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/); //expect the element with the heading role to have a substring match of Doggy Directory.
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed"); //expect the select input to have an exact display value of Select a breed.
  //fix the warning
  expect(await screen.findByRole("option", { name: "husky"})).toBeInTheDocument(); // to test asynchronous code
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled(); //expect the Search button to be disabled since a selection has not been made.
  expect(screen.getByRole("img")).toBeInTheDocument(); //expect the placeholder image to be present in the document since a search has not taken place.
});


test("should be able to search and display dog image results", async () => {
  render(<App />);
  
  
  //Simulate selecting an option and verifying its value
  const select = screen.getByRole("combobox");
  // wait for the cattledog option to appear in the document before proceeding with further assertions.
   expect(await screen.findByRole("option", { name: "cattledog"})).toBeInTheDocument();
   userEvent.selectOptions(select, "cattledog");
  expect(select).toHaveValue("cattledog");
  

  //Simulate initiating the search request
   const searchBtn = screen.getByRole("button", { name: "Search" });
  expect(searchBtn).not.toBeDisabled();
  //jest-dom matcher will verify that the search
  //button is not disabled when a breed selection is made.
  userEvent.click(searchBtn); //simulates clicking the search button.
  

  //Loading state displays and gets removed once results are displayed
  //async helper function imported earlier will wait for the appearance and disappearance of the 
  //Loading message while the search API call is in flight. 
  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));
   // it checks for the absence of an element without throwing an error.

  
  //Verify image display and results count
   const dogImages = screen.getAllByRole("img");
   expect(dogImages).toHaveLength(2); // matcher to verify that there are two images displayed.
   expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
   expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2"); // to check alt text
   expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
})