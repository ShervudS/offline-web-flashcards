import { FormEventHandler, useMemo } from "react";
import { useUnit } from "effector-react";

import { InputControl } from "_shared/control/InputControl";
import { TextAreaControl } from "_shared/control/TextAreaControl";
import { Button } from "_shared/Button";
import { MultiselectControl } from "_shared/control/MultiselectControl";
import { Typography } from "_shared/Typography";

import {
  $answer,
  $answerError,
  answerChanged,
  $question,
  $questionError,
  questionChanged,
  $note,
  noteChanged,
  $formDisabled,
  formSubmitted,
  $tags,
  tagsChanged,
} from "./model";
import { $tagsCollection } from "_entities/tags/model/tags.model";

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

const NoteField = () => {
  const [note, changeNote, formDisabled] = useUnit([
    $note,
    noteChanged,
    $formDisabled,
  ]);

  return (
    <TextAreaControl
      value={note}
      onChange={(e) => changeNote(e.target.value)}
      disabled={formDisabled}
      name="note"
      label="Note"
      placeholder="Write note for you translane"
      className="col-span-3"
    />
  );
};

const TagsField = () => {
  const [tagsCollection, tags, changeTags, formDisabled] = useUnit([
    $tagsCollection,
    $tags,
    tagsChanged,
    $formDisabled,
  ]);

  const options = useMemo(
    () =>
      tagsCollection.map((tag) => ({
        id: tag.id,
        name: tag.name,
        value: tag.id,
      })),
    [tagsCollection]
  );

  return (
    <MultiselectControl
      options={options}
      value={tags}
      onChange={(e) => changeTags([e.target.value])}
      disabled={formDisabled}
      name="tags"
      label="Tags"
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
      className="grid grid-cols-3 gap-2 p-2 bg-gray-900 dark:bg-gray-400 rounded-2xl text-center"
    >
      <Typography variant="h3" className="col-span-3 text-left font-bold">
        Create new flashcard
      </Typography>

      <QuestionField />

      <AnswerField />

      <TagsField />

      <NoteField />

      <Button type="submit" isLoading={formDisabled}>
        Save
      </Button>
    </form>
  );
};
