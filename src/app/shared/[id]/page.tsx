import TableDisplay from '@/src/components/table_display/table_display';
import TableSettings from '@/src/components/table_settings_bar/table_settings_bar';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import { isNumeric } from '@/src/utils/general';
import styles from './shared_comparison_page.module.css';

const getComparisonTable = async (
	id: string
): Promise<{
	name: string;
	attributes: IAttribute[];
	entries: IEntry[];
}> => {
	if (!(id && isNumeric)) throw new Error('Could not find comparison');
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/table`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			comparisonID: id,
		}),
	});

	const data = await res.json();

	return {
		name: data.name,
		attributes: data.attributes,
		entries: data.entries,
	};
};

export default async function SharedComparisonPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { attributes, entries } = await getComparisonTable(id);

	return (
		<div className={styles.shared_comparison_page_container}>
			<TableDisplay attributes={attributes} entries={entries} />
			<div>
				<TableSettings />
			</div>
		</div>
	);
}
