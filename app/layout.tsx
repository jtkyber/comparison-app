import Nav from './_nav/nav';
import './globals.css';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='layout'>
				<Nav />
				{children}
			</body>
		</html>
	);
}
