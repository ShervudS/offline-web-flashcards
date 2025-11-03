import { clsx } from "clsx";
import { type HTMLAttributes, type PropsWithChildren } from "react";

type TTypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "p"
	| "span"
	| "div";

type TTypographyProps = HTMLAttributes<HTMLElement> &
	PropsWithChildren & {
		variant?: TTypographyVariant;
		className?: string;
	};

const variantStyles: Record<TTypographyVariant, string> = {
	h1: "text-4xl font-bold text-gray-100 dark:text-gray-950",
	h2: "text-3xl font-semibold text-gray-100 dark:text-gray-950",
	h3: "text-3xl font-bold text-gray-50 dark:text-gray-base",
	h4: "text-2xl font-semibold text-gray-100 dark:text-gray-950",
	h5: "text-xl font-medium text-gray-100 dark:text-gray-950",
	h6: "text-lg font-medium text-gray-100 dark:text-gray-950",
	p: "text-base font-normal text-gray-100 dark:text-gray-950",
	span: "text-base font-normal text-gray-100 dark:text-gray-950",
	div: "text-base font-normal text-gray-100 dark:text-gray-950",
};

export const Typography = ({
	variant = "p",
	className,
	children,
	...rest
}: TTypographyProps) => {
	const classes = clsx(variantStyles[variant], className);

	const Component = variant;

	return (
		<Component className={classes} {...rest}>
			{children}
		</Component>
	);
};

