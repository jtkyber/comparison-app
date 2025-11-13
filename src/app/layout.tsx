import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Footer from '../components/footer/footer';
import Nav from '../components/nav/nav';
import './globals.css';
import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
	title: 'CompareIt',
};

const roboto = Roboto({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<StoreProvider>
				<body className={`${roboto.variable}`}>
					<Nav />
					{children}
					<Footer />
				</body>
			</StoreProvider>
		</html>
	);
}
