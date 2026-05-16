import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders main dashboard heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "내 투자, 한 눈에" })).toBeInTheDocument();
  });
});
