import { FormEventHandler } from "react";

import { InputControl } from "_shared/control/InputControl";
import { Button } from "_shared/Button";

import { getBaseCardCnfig } from "_features/flashCards/utils/updateCard";

import { TFlashCard } from "_features/flashCards/types";

import styles from "./styles.module.scss";

type TFlashCardForm = {
  onSave: (arg0: TFlashCard) => void;
};

export const FlashCardForm = ({ onSave }: TFlashCardForm) => {
  // const [errors, setErrors] = useState<null | Record<string, any>>(null);

  const onSaveCard: FormEventHandler<HTMLFormElement> = (e) => {
    let newFlashCard: Record<string, any> = {};
    const formData = new FormData(e.currentTarget);

    e.preventDefault();

    for (let [key, value] of formData.entries()) {
      if (value) newFlashCard[key] = value;
    }
    /**
     * TODO:
     * Логика проверки на ошибки + логика сохранения
     */

    onSave(getBaseCardCnfig(newFlashCard as any));
  };

  return (
    <form onSubmit={onSaveCard} className={styles.form}>
      <InputControl
        name="question"
        type="text"
        placeholder="Question"
        required
      />

      <InputControl name="answer" type="text" placeholder="Answer" required />
      <Button type="submit"> Save</Button>
    </form>
  );
};
