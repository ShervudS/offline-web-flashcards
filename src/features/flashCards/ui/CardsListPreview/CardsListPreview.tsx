import { FlashCardInfo } from "./FlashCardInfo";

import type { Nullable } from "_types/index";
import type { TFlashCard, TRemoveFlashCard } from "_entities/cards/types";

type TCardsListPreview = {
	cards: Nullable<TFlashCard[]>;
	onRemoveCard: (removeCard: TRemoveFlashCard) => void;
};

export const CardsListPreview = ({
	cards,
	onRemoveCard,
}: TCardsListPreview) => {
	return (
		<div className="w-full grid gap-9 grid-cols-[repeat(auto-fill,minmax(20rem,20%))]">
			{cards?.map(({ id, question, answer, ef }) => (
				<FlashCardInfo
					key={id}
					id={id}
					ef={ef}
					question={question}
					answer={answer}
					onRemove={onRemoveCard}
				/>
			))}
		</div>
	);
};
