import { useList } from "effector-react";

import { $formatedUploadWords } from "../model";

export const UploadPreviewList = () => (
  <ul>
    {useList($formatedUploadWords, ({ word, translation }) => (
      <li>
        <span>{word}</span> - <span>{translation}</span>
      </li>
    ))}
  </ul>
);
