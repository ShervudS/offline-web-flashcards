import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";

import { buildBaseCardConfig } from "_features/flashCards/utils/updateCard";

import { IndexDB } from "_processes/indexDb";

import type { Nullable } from "_types/index";
import type { TCreateFlashCard, TFlashCard, TRemoveFlashCard } from "./types";

type TCardsContext = {
	cards: Nullable<TFlashCard[]>;
	addCards: (data: TFlashCard) => void;
	onCreateFlashCard: (newCardData: TCreateFlashCard) => void;
	onRemoveFlashCard: (removeCard: TRemoveFlashCard) => void;
};

// @ts-ignore
export const CardsContext = createContext<TCardsContext>();

export const CardsProvider = ({ children }: PropsWithChildren<{}>) => {
	const cardsDb = new IndexDB<TFlashCard>("flashCards", "cards");

	const [cards, setCards] = useState<TCardsContext["cards"]>(null);

	const initializeDatabase = async () => {
		const cardsFromDB = await cardsDb.getAll();

		setCards(cardsFromDB);
	};

	useEffect(() => {
		initializeDatabase();
	}, []);

	const onSaveFlashCard = useCallback(async (cardData: TFlashCard) => {
		try {
			await cardsDb.add(cardData);

			setCards((prev) => [...(prev || []), cardData]);
		} catch (error) {
			console.error("Ошибка при добавлении:", error);
		}
	}, []);

	const onCreateFlashCard = useCallback(
		async (newCardData: TCreateFlashCard) => {
			try {
				const newCard = buildBaseCardConfig(newCardData);

				setCards((prev) => [...(prev || []), newCard]);
			} catch (error) {
				console.error("Ошибка при добавлении:", error);
			}
		},
		[],
	);

	const onRemoveFlashCard = useCallback(
		async (removeCard: TRemoveFlashCard) => {
			const oldCards = cards;

			try {
				setCards(
					(prev) => prev?.filter(({ id }) => id !== removeCard.id) || null,
				);

				await cardsDb.delete(removeCard.id);
			} catch (error) {
				setCards(oldCards);
				console.error("Ошибка при удаления:", error);
			}
		},
		[],
	);

	return (
		<CardsContext.Provider
			value={{
				cards,
				addCards: onSaveFlashCard,
				onCreateFlashCard,
				onRemoveFlashCard,
			}}
		>
			{children}
		</CardsContext.Provider>
	);
};
