import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { findByText } = render(<Application />);

  return findByText("Monday");
});
