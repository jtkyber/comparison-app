import Nav from '../components/nav/nav';
import './globals.css';
import StoreProvider from './StoreProvider';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<StoreProvider>
				<body className='layout'>
					<Nav />
					{children}
				</body>
			</StoreProvider>
		</html>
	);
}
