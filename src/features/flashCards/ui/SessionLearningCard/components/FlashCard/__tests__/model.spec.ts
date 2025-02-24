import { describe, it, expect, beforeEach } from "vitest";
import { fork, allSettled } from "effector";

import {
  displayedCard,
  showedHintOfAmountLettres,
  showedHintOfFirstLetter,
  answeredCard,
  $hintType,
  $showTime,
  $responseTime,
  $isVisibleBtnOnShowAmounLetters,
  $isVisibleAmountLetters,
  $isVisibleFirstLetter,
} from "../model";
import { CARD_HINT } from "_entities/cards/types";

describe("Flashcard Model", () => {
  const scope = fork();

  beforeEach(() => {
    $hintType.reset();
    $showTime.reset();
  });

  it("should update hintType store when showedHintOfAmountLettres is triggered", async () => {
    await allSettled(showedHintOfAmountLettres, { scope });

    expect(scope.getState($hintType)).toBe(CARD_HINT.AMOUNT_LETTERS);
  });

  it("should update hintType store when showedHintOfFirstLetter is triggered", async () => {
    await allSettled(showedHintOfFirstLetter, { scope });

    expect(scope.getState($hintType)).toBe(CARD_HINT.FIRST_LETTER);
  });

  it("should update responseTime store when answeredCard is triggered", async () => {
    const before = Date.now();

    await allSettled(answeredCard, { scope });

    expect(scope.getState($responseTime)).toBeGreaterThanOrEqual(before);
  });

  it("should verify button visibility initially", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    expect(scope.getState($isVisibleBtnOnShowAmounLetters)).toBe(true);
  });

  it("should hide button when amount letters hint is shown", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfAmountLettres, { scope });

    expect(scope.getState($isVisibleBtnOnShowAmounLetters)).toBe(false);
  });

  it("should hide button when first letter hint is shown", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfFirstLetter, { scope });

    expect(scope.getState($isVisibleBtnOnShowAmounLetters)).toBe(false);
  });

  it("should verify initial visibility of amount letters hint", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    expect(scope.getState($isVisibleAmountLetters)).toBe(false);
  });

  it("should show amount letters hint when triggered", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfAmountLettres, { scope });

    expect(scope.getState($isVisibleAmountLetters)).toBe(true);
  });

  it("should keep amount letters hint hidden when first letter hint is triggered", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfFirstLetter, { scope });

    expect(scope.getState($isVisibleAmountLetters)).toBe(false);
  });

  it("should verify initial visibility of first letter hint", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    expect(scope.getState($isVisibleFirstLetter)).toBe(false);
  });

  it("should keep first letter hint hidden when amount letters hint is triggered", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfAmountLettres, { scope });

    expect(scope.getState($isVisibleFirstLetter)).toBe(false);
  });

  it("should show first letter hint when triggered", async () => {
    const scope = fork({
      values: [[$hintType, CARD_HINT.DEFAULT]],
    });

    await allSettled(showedHintOfFirstLetter, { scope });

    expect(scope.getState($isVisibleFirstLetter)).toBe(true);
  });
});
