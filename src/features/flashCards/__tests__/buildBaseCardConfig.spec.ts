import { describe, it, expect } from "vitest";
import { buildBaseCardConfig } from "../utils/updateCard";

describe("buildBaseCardConfig", () => {
	it("should return correct configuration with default values", () => {
		const answer = "Some answer";
		const question = "Some question";

		const result = buildBaseCardConfig({ answer, question });

		expect(result).toHaveProperty("answer", answer);
		expect(result).toHaveProperty("question", question);

		const curDateTime = Date.now();
		expect(result.id).toBeGreaterThanOrEqual(curDateTime - 1000);
		expect(result.id).toBeLessThanOrEqual(curDateTime);
		expect(result.nextReview).toBe(result.id);

		expect(new Date(result.createDatetime).getTime()).toBeGreaterThanOrEqual(
			curDateTime - 1000,
		);
		expect(new Date(result.createDatetime).getTime()).toBeLessThanOrEqual(
			curDateTime,
		);

		expect(result.repetition).toBe(0);
		expect(result.ef).toBe(2.5);
		expect(result.interval).toBe(1);
	});

	it("should handle custom answer and question", () => {
		const answer = "Custom answer";
		const question = "Custom question";

		const result = buildBaseCardConfig({ answer, question });

		expect(result.answer).toBe(answer);
		expect(result.question).toBe(question);
	});
});
