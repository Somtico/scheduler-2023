import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  fireEvent,
  findByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  getByText,
  queryByText,
  getByTestId,
  findByAltText,
  getByDisplayValue,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { queryByText, getByText, findByText } = render(<Application />);

    return findByText("Monday").then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(queryByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 5. Click the first interviewer in the list.
    const interviewers = getAllByTestId(appointment, "interviewers");
    const interviewer = interviewers[1];

    fireEvent.click(getByTestId(interviewer, "interviewer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(queryByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await findByText(appointment, "Lydia Miller-Jones");

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();

    // 4. Click the "Delete" button on the first booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 5. Check that the element with the text "Are you sure you would like to delete?" is displayed.
    expect(
      queryByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 6. Click the "Confirm" button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(queryByText(container, "Deleting")).toBeInTheDocument();

    // 8. Wait until the element with the "Add" button is displayed.
    await findByAltText(appointment, "Add");

    // 9. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    expect(queryByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();

    // 4. Click the "Edit" button on the first booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 5. Change the name.
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Somto Ufondu" },
    });

    // 6. Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(queryByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the "Somto Ufondu" button is displayed.
    await findByText(appointment, "Somto Ufondu");

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
  // Mock the axios PUT request to fail
  axios.put.mockRejectedValueOnce(new Error("Save failed"));

  // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await findByText(container, "Archie Cohen");

  // 3. Click the "Add" button on the first empty appointment.
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));

  // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });

  // 5. Click the first interviewer in the list.
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 6. Click the "Save" button on that same appointment.
  fireEvent.click(getByText(appointment, "Save"));

  // 7. Check that the element with the text "Saving" is displayed.
  expect(queryByText(appointment, "Saving")).toBeInTheDocument();

  // 8. Wait for the "Could not book appointment." error message to be displayed.
  await findByText(appointment, "Could not book appointment.");

  // 9. Ensure the "Saving" indicator is no longer displayed.
  expect(queryByText(appointment, "Saving")).not.toBeInTheDocument();
});

it("shows the delete error when failing to delete an existing appointment", async () => {
  // Mock the axios DELETE request to fail
  axios.delete.mockRejectedValueOnce(new Error("Delete failed"));

  // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await findByText(container, "Archie Cohen");

  // 3. Click the "Delete" button on the first booked appointment.
  const appointment = getAllByTestId(container, "appointment").find(
    (appointment) => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(getByAltText(appointment, "Delete"));

  // 4. Check that the element with the text "Are you sure you would like to delete?" is displayed.
  expect(queryByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

  // 5. Click the "Confirm" button.
  fireEvent.click(getByText(appointment, "Confirm"));

  // 6. Check that the element with the text "Deleting" is displayed.
  expect(queryByText(appointment, "Deleting")).toBeInTheDocument();

  // 7. Wait for the "Could not cancel appointment." error message to be displayed.
  await findByText(appointment, "Could not cancel appointment.");

  // 8. Ensure the "Deleting" indicator is no longer displayed.
  expect(queryByText(appointment, "Deleting")).not.toBeInTheDocument();
});
});
