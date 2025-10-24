import { setEntryCellRating, setEntryFinalRating } from '@/src/lib/features/comparison/displaySlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { CellValueType, ICellValue, IEntry } from '@/src/types/entries.types';
import { ratingToColor } from '@/src/utils/colors';
import { useDebounceCallback } from '@react-hook/debounce';
import React, { useEffect } from 'react';
import styles from './table_display.module.css';

const TableDisplay = () => {
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);
	const display = useAppSelector(state => state.display);

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

		const { type, range, bestIndex, selfRated } = attribute;

		switch (type) {
			case 'number':
				if (typeof value === 'number' && bestIndex !== null) {
					return getRatingFromRange(value, range, bestIndex);
				}
				return;
			case 'yesNo':
				if (bestIndex === 0) return value === false ? 10 : 0;
				else return value === true ? 10 : 0;
			case 'text':
				if (selfRated === true && rating !== null) return rating;
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
			if (cellRating === undefined) continue;

			dispatch(
				setEntryCellRating({
					entryID: entryID,
					attributeID: attributes[i].id,
					rating: cellRating,
				})
			);

			ratingNumerator += cellRating * importance;
			ratingDenominator += importance;
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
		const rating: number = display.entryRatings?.[entryID]?.[attrID];
		const attrIndex: number = attributes.findIndex(a => a.id === attrID);
		const type = attributes[attrIndex]?.type;
		const selfRated = attributes[attrIndex]?.selfRated;

		if (rating === undefined || type === 'link' || (type === 'text' && !selfRated)) {
			return 'var(--color-grey0)';
		}
		return ratingToColor(rating);
	};

	const resizeCells = useDebounceCallback(
		() => {
			const maxColWidths: {
				[key: string]: number;
			} = {};

			const attributeEls = document.querySelectorAll(`.${styles.attribute}`);
			const entryCellEls = document.querySelectorAll(`.${styles.entry_cell}`);

			// get attribute name widths
			for (let i = 0; i < attributeEls.length; i++) {
				const attrEl = attributeEls[i] as HTMLDivElement;
				const id = attrEl.id.split(':')[1];
				const attrNameEl = attrEl.querySelector(`.${styles.attribute_name}`);
				const width = attrNameEl?.getBoundingClientRect().width;
				maxColWidths[id] = width ?? 0;
			}

			// look through all entry cell values and set largest width for each column
			for (let i = 0; i < entryCellEls.length; i++) {
				const entryCell = entryCellEls[i] as HTMLDivElement;
				const id = entryCell.id;
				const entryCellValueEl = entryCell.querySelector(`.${styles.entry_value}`);
				const width = entryCellValueEl?.getBoundingClientRect().width;
				const attrID = id.split(':')[2];
				if (width && width > maxColWidths[attrID]) maxColWidths[attrID] = width;
			}

			// set attribute name element widths
			for (let i = 0; i < attributeEls.length; i++) {
				const attrEl = attributeEls[i] as HTMLDivElement;
				const id = attrEl.id.split(':')[1];
				attrEl.style.width = `${maxColWidths[id]}px`;
			}

			// set entry cell element widths
			for (let i = 0; i < entryCellEls.length; i++) {
				const entryCell = entryCellEls[i] as HTMLDivElement;
				const id = entryCell.id;
				const attrID = id.split(':')[2];
				entryCell.style.width = `${maxColWidths[attrID]}px`;
			}
		},
		250,
		false
	);

	useEffect(() => {
		resizeCells();
		calculateFinalRatings();
	}, [attributes, entries]);

	return (
		<div className={styles.table_display_container}>
			{attributes.length || entries.length ? (
				<div className={styles.table}>
					<div className={styles.attribute_section}>
						<div className={styles.corner_gap}></div>
						{attributes
							.filter(a => !a.hidden)
							.map(attr => (
								<div
									key={attr.id}
									id={`attribute:${attr.id}`}
									className={`${styles.attribute} ${
										display.highlightedAttribute === attr.id ? styles.highlighted : null
									}`}>
									<h4 className={styles.attribute_name}>{attr.name}</h4>
								</div>
							))}
						<h4 className={styles.final_rating_label}>Final Rating</h4>
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
														id={`cell:${entry.id}:${attr.id}`}
														className={`${styles.entry_cell} ${
															display.highlightedAttribute === attr.id ? styles.highlighted : null
														}`}
														style={{ backgroundColor: determineCellColor(entry.id, attr.id) }}>
														{value === undefined || value === null || value === '' ? null : (
															<h5 className={styles.entry_value}>{`${attr.prefix ?? ''}${value}${
																attr.suffix ?? ''
															}`}</h5>
														)}
													</div>
												);
											})}
									</div>
									<h4
										style={{ backgroundColor: ratingToColor(display.entryRatings[entry.id]?.rating || 0) }}
										className={styles.final_rating}>
										{display.entryRatings[entry.id]?.rating || 0}
									</h4>
								</div>
							))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default TableDisplay;
