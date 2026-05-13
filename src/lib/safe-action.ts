import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return "Something went wrong, please try again.";
  },
});
