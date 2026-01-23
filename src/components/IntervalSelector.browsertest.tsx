import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import IntervalSelector from "./IntervalSelector.tsx";

test("Invokes callbacks", async () => {
  const onIntervalChangeMock = vi.fn();

  const screen = await render(
    <IntervalSelector onIntervalChange={onIntervalChangeMock} interval={123} />,
  );

  await expect.element(screen.getByText("123")).toBeInTheDocument();

  await screen.getByRole("spinbutton").fill("456");

  expect(onIntervalChangeMock).toHaveBeenCalledWith(456);

  await screen.getByRole("button", { name: /^weekly/i }).click();
  expect(onIntervalChangeMock).toHaveBeenCalledWith(7);
});
