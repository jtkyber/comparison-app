import Footer from '../components/footer/footer';
import Nav from '../components/nav/nav';
import './globals.css';
import StoreProvider from './StoreProvider';

export default async function RootLayout({
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
					<Footer />
				</body>
			</StoreProvider>
		</html>
	);
}
