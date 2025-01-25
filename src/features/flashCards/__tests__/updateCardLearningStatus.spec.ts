import { describe, it, expect } from "vitest";
import { updateCardLearningStatus } from "../utils/updateCard";

describe("updateCardLearningStatus", () => {
  const mockCard = {
    id: 777,
    question: "MOCK_QUESTION",
    answer: "MOCK_ANSWER",
    createDatetime: "MOCK_DATE",
    ef: 2.5,
    interval: 1,
    repetition: 0,
    nextReview: Date.now(),
  };

  it("should correctly update the card for a correct answer with no hint", () => {
    const updatedCard = updateCardLearningStatus({
      card: {
        ...mockCard,
      },
      responseTime: 5,
      isCorrect: true,
      hintType: "none",
      isRepeatCard: false,
    });

    expect(updatedCard.ef).toBeGreaterThan(2.5);
    expect(updatedCard.interval).toBe(1);
  });

  // it("should apply penalty for a correct answer with letters hint", () => {
  //   const updatedCard = updateCardLearningStatus({
  //     card: { ...mockCard },
  //     responseTime: 8,
  //     isCorrect: true,
  //     hintType: "letters",
  //     isRepeatCard: false,
  //   });

  //   expect(updatedCard.ef).toBeGreaterThan(2.5);
  // });

  it("should reset repetition and interval for an incorrect answer", () => {
    const updatedCard = updateCardLearningStatus({
      card: { ...mockCard },
      responseTime: 8,
      isCorrect: false,
      hintType: "none",
      isRepeatCard: false,
    });

    expect(updatedCard.repetition).toBe(0);
    expect(updatedCard.interval).toBe(1);
  });

  it("should update nextReview based on interval and EF", () => {
    const updatedCard = updateCardLearningStatus({
      card: { ...mockCard },
      responseTime: 5,
      isCorrect: true,
      hintType: "none",
      isRepeatCard: false,
    });

    const expectedNextReview =
      Date.now() + updatedCard.interval * 24 * 60 * 60 * 1000;
    expect(updatedCard.nextReview).toBeGreaterThanOrEqual(
      expectedNextReview - 1000
    );
    expect(updatedCard.nextReview).toBeLessThanOrEqual(
      expectedNextReview + 1000
    );
  });

  it("should update interval and repetition correctly with multiple correct answers", () => {
    const firstRightAnswer = updateCardLearningStatus({
      card: { ...mockCard },
      responseTime: 5,
      isCorrect: true,
      hintType: "none",
      isRepeatCard: false,
    });
    const secondRightAnswer = updateCardLearningStatus({
      card: { ...firstRightAnswer },
      responseTime: 5,
      isCorrect: true,
      hintType: "none",
      isRepeatCard: true,
    });

    expect(secondRightAnswer.interval).toBe(1);
    // expect(secondRightAnswer.repetition).toBe(2);
  });
});
