import { useContext } from "react";

import { CardsListPreview } from "../CardsListPreview";
import { SessionLearningCard } from "../SessionLearningCard";
import { FlashCardForm } from "../FlashCardForm";

import { CardsContext } from "_entities/cards";

export const FlashCardsWrapper = () => {
	const { cards, onCreateFlashCard, onRemoveFlashCard } =
		useContext(CardsContext);

	return (
		<div className="flex flex-col gap-9 items-baseline">
			<FlashCardForm onSave={onCreateFlashCard} />

			{/* <div> */}
			{/* <Button onClick={handlerPrevCard} disabled={!cards || !currentIndex}>
          Вернуться
        </Button>

        <Button onClick={resetCurIndex} disabled={!currentIndex}>
          Сбросить
        </Button> */}
			{/* </div> */}

			{cards && <SessionLearningCard cards={cards} />}

			<div className="w-full">
				<h2>All flashCards</h2>

				<CardsListPreview cards={cards} onRemoveCard={onRemoveFlashCard} />
			</div>
		</div>
	);
};
