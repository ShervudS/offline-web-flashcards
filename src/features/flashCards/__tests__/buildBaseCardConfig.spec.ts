import { describe, it, expect } from "vitest";
import { buildBaseCardConfig } from "../utils/updateCard";

describe("buildBaseCardConfig", () => {
	it("should return correct configuration with default values", () => {
		const answer = "Some answer";
		const question = "Some question";

		const result = buildBaseCardConfig({ answer, question, tags: [] });

		expect(result).toHaveProperty("answer", answer);
		expect(result).toHaveProperty("question", question);

		expect(result.repetition).toBe(0);
		expect(result.ef).toBe(2.5);
		expect(result.interval).toBe(1);
	});

	it("should handle custom answer and question", () => {
		const answer = "Custom answer";
		const question = "Custom question";

		const result = buildBaseCardConfig({ answer, question, tags: [] });

		expect(result.answer).toBe(answer);
		expect(result.question).toBe(question);
	});
});
