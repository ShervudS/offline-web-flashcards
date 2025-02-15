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

// const FormControl = ({ name, ...rest }) => {
//   const value = useStoreMap({
//     store: $form,
//     keys: [name],
//     fn: (values) => values[name] ?? "",
//   });
//   return (
//     <InputControl
//       name={name}
//       value={value}
//       onChange={handleChangeFormField}
//       {...rest}
//     />
//   );
// };

export const FlashCardForm = () => {
  const [
    question,
    questionError,
    changeQuestion,
    answer,
    answerError,
    changeAnswer,
    formDisabled,
  ] = useUnit([
    $question,
    $questionError,
    questionChanged,
    $answer,
    $answerError,
    answerChanged,
    $formDisabled,
  ]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    formSubmitted();
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex items-center flex-wrap gap-6 p-8"
    >
      <p>Create new flashcard</p>

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

      <InputControl
        value={answer}
        onChange={(e) => changeAnswer(e.target.value)}
        disabled={formDisabled}
        error={answerError}
        name="question"
        label="Question"
        placeholder="Question"
        required
      />

      <Button type="submit" isLoading={formDisabled}>
        Save
      </Button>
    </form>
  );
};
