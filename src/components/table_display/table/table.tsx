// 'use client';
// import { useAppSelector } from '@/src/lib/hooks';
// import { IAttribute } from '@/src/types/attributes.types';
// import { IEntry } from '@/src/types/entries.types';
// import React from 'react';
// import styles from './table.module.css';
// import { ratingToColor } from '@/src/utils/colors';

// const Table = ({ attributes, entries }: { attributes: IAttribute[]; entries: IEntry[] }) => {
// 	const display = useAppSelector(state => state.display);

// 	return (
// 		<table
// 			className={`${styles.table} ${fitColMin ? styles.fit_cell_min : null} ${
// 				colorCellsByRating ? styles.colored : null
// 			}`}>
// 			<thead>
// 				<tr>
// 					<th>&nbsp;</th>
// 					{attributes
// 						.filter(attr => !attr.hidden)
// 						.map(attr => (
// 							<th
// 								className={`${styles.attribute_name} ${
// 									display.highlightedAttribute === attr.id ? styles.highlighted : null
// 								}`}
// 								key={attr.id}>
// 								{attr?.name}
// 							</th>
// 						))}
// 					<th>Score</th>
// 				</tr>
// 			</thead>
// 			<tbody>
// 				{entries
// 					.filter(entry => !entry.hidden)
// 					.map(entry => {
// 						const { id: entryID, name: entryName } = entry || {};

// 						return (
// 							<tr
// 								className={`${styles.table_row} ${
// 									display.highlightedEntry === entryID ? styles.highlighted : null
// 								}`}
// 								key={entryID}>
// 								<th>{entryName}</th>
// 								{attributes
// 									.filter(attr => !attr.hidden)
// 									.map(attr => {
// 										const { value } = entry.cells[attr.id] || {};
// 										const { id: attrID, prefix, suffix, type } = attr || {};

// 										return (
// 											<td
// 												className={`${styles.cell} ${
// 													display.highlightedAttribute === attrID ? styles.highlighted : null
// 												}`}
// 												style={{
// 													backgroundColor: colorCellsByRating
// 														? determineCellColor(entryID, attrID)
// 														: 'transparent',
// 												}}
// 												key={`${entryID}_${attrID}`}
// 												onClick={() => handleCellClick(entryID, attrID)}>
// 												{prefix}
// 												{type === 'link' ? (
// 													<a
// 														className={`${styles.link} ${ctrlDown ? styles.clickable : null}`}
// 														href={value as string}
// 														target='_blank'
// 														rel='noopener noreferrer'>
// 														Link
// 													</a>
// 												) : type === 'yesNo' ? (
// 													value === true ? (
// 														'Yes'
// 													) : (
// 														'No'
// 													)
// 												) : (
// 													value
// 												)}
// 												{suffix}
// 											</td>
// 										);
// 									})}
// 								<td
// 									style={{
// 										backgroundColor: colorCellsByRating
// 											? ratingToColor(display.entryRatings[entry.id]?.rating)
// 											: 'transparent',
// 									}}
// 									className={styles.rating_cell}>
// 									{display.entryRatings[entry.id]?.rating || ''}
// 								</td>
// 							</tr>
// 						);
// 					})}
// 			</tbody>
// 		</table>
// 	);
// };

// export default Table;
