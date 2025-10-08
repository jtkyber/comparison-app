import Footer from '../components/footer/footer';
import Nav from '../components/nav/nav';
import './globals.css';
import StoreProvider from './StoreProvider';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/${[1, 3]}`);
	const comparisons = await res.json();

	return (
		<html lang='en'>
			<StoreProvider>
				<body className='layout'>
					<Nav comparisons={comparisons} />
					{children}
					<Footer />
				</body>
			</StoreProvider>
		</html>
	);
}
