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
      responseTime: 5, // Время ответа меньше максимального
      isCorrect: true,
      hintType: "none", // Без подсказки
      isRepeatCard: false,
    });

    // Проверяем обновленные параметры
    // expect(updatedCard.ef).toBeGreaterThan(2.275); // EF должен увеличиться
    expect(updatedCard.interval).toBe(1); // Первый интервал должен быть равен 1
    // expect(updatedCard.repetition).toBe(1); // Количество повторений должно увеличиться
  });

  // it("should apply penalty for a correct answer with letters hint", () => {
    // const updatedCard = updateCardLearningStatus({
    //   card: { ...mockCard },
    //   responseTime: 8, // Время ответа меньше максимального
    //   isCorrect: true,
    //   hintType: "letters", // Подсказка с количеством букв
    //   isRepeatCard: false,
    // });

    // Проверяем, что штраф за подсказку применился
    // expect(updatedCard.ef).toBeGreaterThan(2.5); // EF должен увеличиться
    // expect(updatedCard.repetition).toBe(1); // Количество повторений должно увеличиться
  // });

  it("should reset repetition and interval for an incorrect answer", () => {
    const updatedCard = updateCardLearningStatus({
      card: { ...mockCard },
      responseTime: 8, // Время ответа больше, чем максимальное
      isCorrect: false, // Неверный ответ
      hintType: "none",
      isRepeatCard: false,
    });

    // Проверяем, что параметры сбросились для неверного ответа
    expect(updatedCard.repetition).toBe(0); // Повторения сбрасываются
    expect(updatedCard.interval).toBe(1); // Интервал сбрасывается
  });

  it("should update nextReview based on interval and EF", () => {
    const updatedCard = updateCardLearningStatus({
      card: { ...mockCard },
      responseTime: 5,
      isCorrect: true,
      hintType: "none",
      isRepeatCard: false,
    });

    // Проверяем, что nextReview обновляется на основе интервала
    const expectedNextReview =
      Date.now() + updatedCard.interval * 24 * 60 * 60 * 1000;
    expect(updatedCard.nextReview).toBeGreaterThanOrEqual(
      expectedNextReview - 1000
    );
    expect(updatedCard.nextReview).toBeLessThanOrEqual(
      expectedNextReview + 1000
    );
  });

  // it("should update interval and repetition correctly with multiple correct answers", () => {
    // Симуляция первого правильного ответа
    // const firstAnswer = updateCardLearningStatus({
    //   card: { ...mockCard },
    //   responseTime: 5,
    //   isCorrect: true,
    //   hintType: "none",
    //   isRepeatCard: false,
    // });

    // Симуляция второго правильного ответа
    // const secondAnswer = updateCardLearningStatus({
    //   card: { ...firstAnswer },
    //   responseTime: 5,
    //   isCorrect: true,
    //   hintType: "none",
    //   isRepeatCard: true,
    // });

    // Проверяем, что интервал увеличился на втором ответе
    // expect(secondAnswer.interval).toBeGreaterThan(firstAnswer.interval);
    // expect(secondAnswer.repetition).toBe(2); // Повторений должно быть больше
  // });
});
