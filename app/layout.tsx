import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Art Beat",
	description: "Art Beat developed by Uttam",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/icon?family=Material+Icons'
				/>
			</head>
			<body className='bg-gray-100'>{children}</body>
		</html>
	);
}
