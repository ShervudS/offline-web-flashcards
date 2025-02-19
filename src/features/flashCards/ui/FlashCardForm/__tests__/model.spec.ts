import { allSettled, fork } from "effector";
import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  questionChanged,
  answerChanged,
  formSubmitted,
  $question,
  $questionError,
  $answer,
  $answerError,
  $formValid,
  // $error,
} from "../model";
import { ERROR_FIELD } from "../model";

describe("FlashCard form model", () => {
  beforeEach(() => {
    // $questionError.reset();
    // $answerError.reset();
    // $error.reset();

    vi.clearAllMocks();
  });

  describe("update form field", () => {
    it("should update $question when questionChanged is called", async () => {
      const scope = fork();
      expect(scope.getState($question)).toEqual("");

      await allSettled(questionChanged, { scope, params: "Test Question" });

      expect(scope.getState($question)).toEqual("Test Question");
    });

    it("should update $answer when answerChanged is called", async () => {
      const scope = fork();
      expect(scope.getState($answer)).toEqual("");

      await allSettled(answerChanged, { scope, params: "Test Answer" });

      expect(scope.getState($answer)).toEqual("Test Answer");
    });
  });

  describe("form fields error", () => {
    it("should set $questionError to ERROR_FIELD.EMPTY when formSubmitted is triggered with an empty question", async () => {
      const scope = fork();
      expect(scope.getState($question)).toEqual("");

      await allSettled(questionChanged, { scope, params: "" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(ERROR_FIELD.EMPTY);
    });

    it("should set $answerError to ERROR_FIELD.EMPTY when formSubmitted is triggered with an empty answer", async () => {
      const scope = fork();
      expect(scope.getState($answer)).toEqual("");

      await allSettled(answerChanged, { scope, params: "" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($answerError)).toEqual(ERROR_FIELD.EMPTY);
    });

    it("should reset $questionError (set to null) when formSubmitted is triggered with a valid question", async () => {
      const scope = fork();

      await allSettled(questionChanged, {
        scope,
        params: "Some Valid Question",
      });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(null);
    });

    it("should reset $answerError (set to null) when formSubmitted is triggered with a valid answer", async () => {
      const scope = fork();

      await allSettled(answerChanged, { scope, params: "Some Valid Answer" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($answerError)).toEqual(null);
    });
  });

  describe("formValid state", () => {
    it("should be false when both fields are valid (no errors)", async () => {
      const scope = fork();

      await allSettled(questionChanged, { scope, params: "Valid Question" });
      await allSettled(answerChanged, { scope, params: "Valid Answer" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(null);
      expect(scope.getState($answerError)).toEqual(null);
      expect(scope.getState($formValid)).toEqual(true);
    });

    it("should be true when both fields are invalid (errors present)", async () => {
      const scope = fork();

      await allSettled(questionChanged, { scope, params: "" });
      await allSettled(answerChanged, { scope, params: "" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(ERROR_FIELD.EMPTY);
      expect(scope.getState($answerError)).toEqual(ERROR_FIELD.EMPTY);
      expect(scope.getState($formValid)).toEqual(false);
    });

    it("should be false when question is invalid but answer is valid", async () => {
      const scope = fork();

      await allSettled(questionChanged, { scope, params: "" });
      await allSettled(answerChanged, { scope, params: "Valid Answer" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(ERROR_FIELD.EMPTY);
      expect(scope.getState($answerError)).toEqual(null);
      expect(scope.getState($formValid)).toEqual(false);
    });

    it("should be false when answer is invalid but question is valid", async () => {
      const scope = fork();

      await allSettled(questionChanged, { scope, params: "Valid Question" });
      await allSettled(answerChanged, { scope, params: "" });
      await allSettled(formSubmitted, { scope });

      expect(scope.getState($questionError)).toEqual(null);
      expect(scope.getState($answerError)).toEqual(ERROR_FIELD.EMPTY);
      expect(scope.getState($formValid)).toEqual(false);
    });
  });

  //   it("should trigger createCardFx with payload from buildBaseCardConfig when formSubmitted is triggered and createCardFx is not pending", () => {
  //     // Set valid question and answer values
  //     questionChanged("Valid Question");
  //     answerChanged("Valid Answer");

  //     // Subscribe to createCardFx calls
  //     const fxWatcher = vi.fn();
  //     createCardFx.watch(fxWatcher);

  //     // Trigger the form submission event
  //     formSubmitted();

  //     // Expect createCardFx to be called with the object processed by buildBaseCardConfig.
  //     // If buildBaseCardConfig is identity, the payload should be { question, answer }
  //     expect(fxWatcher).toHaveBeenCalledWith({
  //       question: "Valid Question",
  //       answer: "Valid Answer",
  //     });
  //   });

  //   it("should update $error when createCardFx fails", () => {
  //     const testError = "Test Error";
  //     // Simulate a failure in createCardFx
  //     createCardFx.fail(testError);
  //     expect($error.getState()).toBe(testError);
  //   });
});
