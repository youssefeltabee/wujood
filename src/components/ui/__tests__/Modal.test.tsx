import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

beforeAll(() => {
  // jsdom does not natively implement HTMLDialogElement methods
  HTMLDialogElement.prototype.showModal = vi.fn(function mockShowModal(this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function mockClose(this: HTMLDialogElement) {
    this.open = false;
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Modal", () => {
  it("renders as a <dialog> element", () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")).toBeInTheDocument();
  });

  it("calls showModal when open becomes true", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it("does not call showModal when open is false", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it("renders children when open", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders children when closed", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Modal>
    );
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal open={true} onClose={() => {}} title="My Modal">
        Content
      </Modal>
    );
    expect(screen.getByText("My Modal")).toBeInTheDocument();
  });

  it("renders title as an h2 element", () => {
    render(
      <Modal open={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Modal Title");
  });

  it("does not render title when not provided", () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders close button with aria-label 'Close'", () => {
    render(
      <Modal open={true} onClose={() => {}} title="Title">
        Content
      </Modal>
    );
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );
    await user.click(screen.getByLabelText("Close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal open={true} onClose={handleClose}>
        Content
      </Modal>
    );
    await user.click(container.querySelector("dialog")!);
    expect(handleClose).toHaveBeenCalled();
  });

  it("applies size class - md by default", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("max-w-lg");
  });

  it("applies size class - sm", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("max-w-sm");
  });

  it("applies size class - lg", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("max-w-2xl");
  });

  it("applies size class - xl", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} size="xl">
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("max-w-4xl");
  });

  it("applies size class - full", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} size="full">
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("max-w-[calc(100vw-2rem)]");
  });

  it("merges custom className on dialog", () => {
    const { container } = render(
      <Modal open={true} onClose={() => {}} className="custom-modal">
        Content
      </Modal>
    );
    expect(container.querySelector("dialog")!.className).toContain("custom-modal");
  });

  it("calls onClose when dialog emits close event (e.g. Escape key)", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal open={true} onClose={handleClose}>
        Content
      </Modal>
    );
    const dialog = container.querySelector("dialog")!;
    // Simulate the dialog being closed (the close event is fired by the browser
    // after close() is called, which sets open=false)
    dialog.open = false;
    fireEvent(dialog, new Event("close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("has displayName set", () => {
    expect(Modal.displayName).toBe("Modal");
  });
});
