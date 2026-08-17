import { startProblemObserver } from "./problemObserver";
import { startSubmissionTracker } from "./submission/submissionTracker";

const stopProblemObserver = startProblemObserver();
const submissionTracker = startSubmissionTracker();

window.addEventListener(
  "beforeunload",
  () => {
    stopProblemObserver();
    submissionTracker.dispose();
  },
  { once: true }
);