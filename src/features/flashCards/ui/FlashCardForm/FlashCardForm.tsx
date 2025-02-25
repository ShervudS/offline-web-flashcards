import { FormEventHandler } from "react";
import { useUnit } from "effector-react";

import { InputControl } from "_shared/control/InputControl";
import { Button } from "_shared/Button";

import {
  $answer,
  $answerError,
  $formDisabled,
  $question,
  $questionError,
  answerChanged,
  formSubmitted,
  questionChanged,
} from "./model";

const QuestionField = () => {
  const [question, questionError, changeQuestion, formDisabled] = useUnit([
    $question,
    $questionError,
    questionChanged,
    $formDisabled,
  ]);

  return (
    <InputControl
      value={question}
      onChange={(e) => changeQuestion(e.target.value)}
      disabled={formDisabled}
      error={questionError}
      name="question"
      label="Question"
      placeholder="Question"
      required
    />
  );
};

const AnswerField = () => {
  const [answer, answerError, changeAnswer, formDisabled] = useUnit([
    $answer,
    $answerError,
    answerChanged,
    $formDisabled,
  ]);

  return (
    <InputControl
      value={answer}
      onChange={(e) => changeAnswer(e.target.value)}
      disabled={formDisabled}
      error={answerError}
      name="answer"
      label="Answer"
      placeholder="Answer"
      required
    />
  );
};

export const FlashCardForm = () => {
  const [formDisabled, onSubmit] = useUnit([$formDisabled, formSubmitted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col flex-wrap gap-2 pt-2 pb-2 sm:flex-row sm:items-center md:gap-4 md:pb-4 md:pt-4 lg:gap-6 lg:pb-8 lg:pt-8"
    >
      <h3 className="text-3xl font-bold text-gray-50 dark:text-gray-900">
        Create new flashcard
      </h3>

      <QuestionField />

      <AnswerField />

      <Button type="submit" isLoading={formDisabled}>
        Save
      </Button>
    </form>
  );
};
