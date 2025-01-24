import { FormEventHandler, useState } from "react";

import { InputControl } from "_shared/control/InputControl";
import { Button } from "_shared/Button";

import type { TCreateFlashCard } from "_entities/cards/types";

import styles from "./styles.module.scss";

type TFlashCardForm = {
  onSave: (arg0: TCreateFlashCard) => void;
};

export const FlashCardForm = ({ onSave }: TFlashCardForm) => {
  const [errors, setErrors] = useState<null | Record<string, any>>(null);

  const onSaveCard: FormEventHandler<HTMLFormElement> = (e) => {
    let newFlashCard: Record<string, any> = {};
    const formData = new FormData(e.currentTarget);

    e.preventDefault();

    for (let [key, value] of formData.entries()) {
      /**
       * TODO:
       * Логика проверки на ошибки
       */
      if (value) newFlashCard[key] = value;
    }
    onSave(newFlashCard as TCreateFlashCard);
  };

  return (
    <form onSubmit={onSaveCard} className={styles.form}>
      <p>Create new flashcard</p>

      <InputControl
        name="question"
        placeholder="Question"
        error={errors?.question}
        required
      />

      <InputControl
        name="answer"
        placeholder="Answer"
        error={errors?.answer}
        required
      />

      <Button type="submit"> Save</Button>
    </form>
  );
};
