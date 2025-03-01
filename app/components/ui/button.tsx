import { cn } from "@/app/lib/utils";

export function Button({
	className,
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={cn(
				"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",
				className,
			)}
			{...props}>
			{children}
		</button>
	);
}
