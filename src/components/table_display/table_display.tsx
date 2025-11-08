import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import styles from './table_display.module.css';

import { setEntryCellRating, setEntryFinalRating } from '@/src/lib/features/comparison/displaySlice';
import { setEditingIndex, setEntryAttributeID, setMode } from '@/src/lib/features/comparison/managerSlice';
import { IAttribute } from '@/src/types/attributes.types';
import { ICellValue, IEntry } from '@/src/types/entries.types';
import { ratingToColor } from '@/src/utils/colors';
import React, { useEffect, useState } from 'react';

const TableDisplay = () => {
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);
	const display = useAppSelector(state => state.display);
	const { fitColMin, colorCellsByRating } = useAppSelector(state => state.settings);

	const [ctrlDown, setCtrlDown] = useState<boolean>(false);

	const dispatch = useAppDispatch();

	const getRatingFromRange = (
		value: number,
		range: [number, number] | [number, number, number],
		best: 0 | 1 | 2
	): number | undefined => {
		const clamp = (n: number) => Math.max(0, Math.min(10, n));

		if (range.length === 2) {
			const [r0, r1] = range;
			const denom: number = r1 - r0;

			if (denom === 0) {
				return clamp(value === r0 ? 10 : value < r0 ? 10 : 0);
			}

			if (best === 0) {
				const mult = (r1 - value) / denom;
				return clamp(mult * 10);
			} else if (best === 1) {
				const mult = (value - r0) / denom;
				return clamp(mult * 10);
			}

			return;
		} else if (range.length === 3) {
			const [r0, r1, r2] = range;

			switch (best) {
				case 0:
					if (value <= r1) {
						return clamp(10 - (5 * (value - r0)) / (r1 - r0));
					} else {
						return clamp(5 - (5 * (value - r1)) / (r2 - r1));
					}
				case 1:
					if (value <= r1) {
						return clamp((10 * (value - r0)) / (r1 - r0));
					} else {
						return clamp((10 * (r1 - value)) / (r2 - r1));
					}
				case 2:
					if (value >= r1) {
						return clamp(10 - (5 * (r2 - value)) / (r2 - r1));
					} else {
						return clamp(5 - (5 * (r1 - value)) / (r1 - r0));
					}
			}
		}

		return;
	};

	const calculateCellRating = (entry: IEntry, attribute: IAttribute): number | undefined => {
		const entryCell: ICellValue = entry.cells[attribute.id];
		if (!entryCell) return;
		const { value, rating } = entryCell;

		if (value === null || value === undefined) return;

		const { type, range, bestIndex, textRatingType, keyRatingPairs } = attribute;

		switch (type) {
			case 'number':
				if (typeof value === 'number' && bestIndex !== null) {
					return getRatingFromRange(value, range, bestIndex);
				}
				return;
			case 'yesNo':
				if (typeof value !== 'boolean') return undefined;
				if (bestIndex === 0) return value === false ? 10 : 0;
				else return value === true ? 10 : 0;
			case 'text':
				if (textRatingType === 'selfrated') return rating ?? undefined;
				else if (textRatingType === 'keyratingpairs') {
					return keyRatingPairs.find(p => p.key === value)?.rating ?? undefined;
				}
				return;
			default:
				return;
		}
	};

	const calculateEntryRating = (entryID: number): number => {
		const entry: IEntry | undefined = entries.find(e => e.id === entryID);

		if (entry === undefined) return 0;

		let ratingNumerator: number = 0;
		let ratingDenominator: number = 0;
		for (let i = 0; i < attributes.length; i++) {
			const importance = attributes[i].importance;
			if (importance === null) continue;
			const cellRating = calculateCellRating(entry, attributes[i]);

			dispatch(
				setEntryCellRating({
					entryID: entryID,
					attributeID: attributes[i].id,
					rating: cellRating,
				})
			);

			if (cellRating !== undefined) {
				ratingNumerator += cellRating * importance;
				ratingDenominator += importance;
			}
		}

		const finalRating = ratingNumerator / ratingDenominator;
		const finalRatingRounded = Math.round(finalRating * 100) / 100;
		return finalRatingRounded;
	};

	const calculateFinalRatings = () => {
		for (const entry of entries) {
			const rating = calculateEntryRating(entry.id);
			dispatch(
				setEntryFinalRating({
					entryID: entry.id,
					rating: rating,
				})
			);
		}
	};

	const determineCellColor = (entryID: number, attrID: number) => {
		const rating: number | undefined = display.entryRatings?.[entryID]?.[attrID];
		const attrIndex: number = attributes.findIndex(a => a.id === attrID);
		const type = attributes[attrIndex]?.type;
		const textRatingType = attributes[attrIndex]?.textRatingType;

		if (
			rating === undefined ||
			type === 'link' ||
			(type === 'text' && (!textRatingType || textRatingType === 'none'))
		) {
			return 'var(--color-grey0)';
		}
		return ratingToColor(rating);
	};

	const handleCellClick = (entryID: number, attrID: number) => {
		const entryIndex: number = entries.findIndex(entry => entry.id === entryID);
		dispatch(setMode('entries'));
		dispatch(setEditingIndex(entryIndex));
		dispatch(setEntryAttributeID(attrID));
	};

	useEffect(() => {
		calculateFinalRatings();

		const handleCtrlDown = (e: KeyboardEvent) => {
			if (e.key !== 'Control') return;
			setCtrlDown(true);
		};
		const handleCtrlUp = (e: KeyboardEvent) => {
			if (e.key !== 'Control') return;
			setCtrlDown(false);
		};

		document.addEventListener('keydown', handleCtrlDown);
		document.addEventListener('keyup', handleCtrlUp);

		return () => {
			document.removeEventListener('keydown', handleCtrlDown);
			document.removeEventListener('keyup', handleCtrlUp);
		};
	}, []);

	useEffect(() => {
		calculateFinalRatings();
	}, [attributes, entries]);

	return attributes.length || entries.length ? (
		<div className={styles.table_display_container}>
			<table
				className={`${styles.table} ${fitColMin ? styles.fit_cell_min : null} ${
					colorCellsByRating ? styles.colored : null
				}`}>
				<thead>
					<tr>
						<th>&nbsp;</th>
						{attributes
							.filter(attr => !attr.hidden)
							.map(attr => (
								<th
									className={`${styles.attribute_name} ${
										display.highlightedAttribute === attr.id ? styles.highlighted : null
									}`}
									key={attr.id}>
									{attr?.name}
								</th>
							))}
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{entries
						.filter(entry => !entry.hidden)
						.map(entry => {
							const { id: entryID, name: entryName } = entry || {};

							return (
								<tr
									className={`${styles.table_row} ${
										display.highlightedEntry === entryID ? styles.highlighted : null
									}`}
									key={entryID}>
									<th>{entryName}</th>
									{attributes
										.filter(attr => !attr.hidden)
										.map(attr => {
											const { value } = entry.cells[attr.id] || {};
											const { id: attrID, prefix, suffix, type } = attr || {};

											return (
												<td
													className={`${styles.cell} ${
														display.highlightedAttribute === attrID ? styles.highlighted : null
													}`}
													style={{
														backgroundColor: colorCellsByRating
															? determineCellColor(entryID, attrID)
															: 'transparent',
													}}
													key={`${entryID}_${attrID}`}
													onClick={() => handleCellClick(entryID, attrID)}>
													{prefix}
													{type === 'link' ? (
														<a
															className={`${styles.link} ${ctrlDown ? styles.clickable : null}`}
															href={value as string}
															target='_blank'
															rel='noopener noreferrer'>
															Link
														</a>
													) : type === 'yesNo' ? (
														value === true ? (
															'Yes'
														) : (
															'No'
														)
													) : (
														value
													)}
													{suffix}
												</td>
											);
										})}
									<td
										style={{
											backgroundColor: colorCellsByRating
												? ratingToColor(display.entryRatings[entry.id]?.rating)
												: 'transparent',
										}}
										className={styles.rating_cell}>
										{display.entryRatings[entry.id]?.rating || ''}
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	) : null;
};

export default TableDisplay;
