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
      className="flex items-center flex-wrap gap-6 pt-8 pb-8"
    >
      <p>Create new flashcard</p>

      <QuestionField />

      <AnswerField />

      <Button type="submit" isLoading={formDisabled}>
        Save
      </Button>
    </form>
  );
};
