import { useAppSelector } from '@/src/lib/hooks';
import { CellValueType } from '@/src/types/entries.types';
import React from 'react';
import styles from './table_display.module.css';

const TableDisplay = () => {
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);
	const display = useAppSelector(state => state.display);

	return (
		<div className={styles.table_display_container}>
			<div className={styles.table}>
				<div className={styles.attribute_section}>
					{entries.length || attributes.length ? <div className={styles.corner_gap}></div> : null}
					{attributes
						.filter(a => !a.hidden)
						.map(attr => (
							<div
								key={attr.id}
								className={`${styles.attribute} ${
									display.highlightedAttribute === attr.id ? styles.highlighted : null
								}`}>
								<h4 className={styles.attribute_name}>{attr.name}</h4>
							</div>
						))}
				</div>
				<div className={styles.entry_section}>
					{entries
						.filter(e => !e.hidden)
						.map(entry => (
							<div
								key={entry.id}
								className={`${styles.entry} ${
									display.highlightedEntry === entry.id ? styles.highlighted : null
								}`}>
								<h4 className={styles.entry_name}>{entry.name}</h4>
								<div className={styles.entry_cell_section}>
									{attributes
										.filter(a => !a.hidden)
										.map(attr => {
											let value: CellValueType = entry.cells[attr.id]?.value;
											if (attr.type === 'yesNo') {
												value = value ? 'Yes' : 'No';
											}

											return (
												<div
													key={`${entry.id}-${attr.id}`}
													className={`${styles.entry_cell} ${
														display.highlightedAttribute === attr.id ? styles.highlighted : null
													}`}>
													{value === undefined || value === null || value === '' ? null : (
														<>
															<h5 className={styles.entry_prefix}>{attr.prefix ?? ''}</h5>
															<h5 className={styles.entry_value}>{value}</h5>
															<h5 className={styles.entry_suffix}>{attr.suffix ?? ''}</h5>
														</>
													)}
												</div>
											);
										})}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default TableDisplay;
