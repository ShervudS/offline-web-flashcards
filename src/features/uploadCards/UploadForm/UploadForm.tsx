import { Button } from "_shared/Button";
import { TextAreaControl } from "_shared/control/TextAreaControl";
import { useUnit } from "effector-react";
import {
  $formDisabled,
  $upload,
  $uploadError,
  formSubmitted,
  uploadChanged,
} from "./model";
import { FormEventHandler } from "react";

const UploadTextFiled = () => {
  const [upload, uploadChange, formDisabled, uploadError] = useUnit([
    $upload,
    uploadChanged,
    $formDisabled,
    $uploadError,
  ]);

  return (
    <TextAreaControl
      value={upload}
      onChange={(e) => uploadChange(e.target.value)}
      disabled={formDisabled}
      error={uploadError}
      min={4}
      name="question"
      placeholder="Paste your words here..."
      required
    />
  );
};

export const UploadForm = () => {
  const [formDisabled, onSubmit] = useUnit([$formDisabled, formSubmitted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <UploadTextFiled />

      <Button type="submit" isLoading={formDisabled}>
        Загрузить
      </Button>
    </form>
  );
};
