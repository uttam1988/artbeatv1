import { cn } from "@/app/lib/utils";

export function Card({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn("bg-white rounded-xl shadow-md p-4", className)}>
			{children}
		</div>
	);
}

export function CardContent({ children }: { children: React.ReactNode }) {
	return <div className='p-2'>{children}</div>;
}
