'use client';
import {
	setDownloading,
	setEntryCellRating,
	setEntryFinalRating,
} from '@/src/lib/features/comparison/displaySlice';
import { setEditingIndex, setEntryAttributeID, setMode } from '@/src/lib/features/comparison/managerSlice';
import { updateTableZoom } from '@/src/lib/features/user/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { ICellValue, IEntry } from '@/src/types/entries.types';
import { ratingToColor } from '@/src/utils/colors';
import { useDebounceCallback } from '@react-hook/debounce';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import styles from './table_display.module.css';

const TableDisplay = ({ attributes, entries }: { attributes: IAttribute[]; entries: IEntry[] }) => {
	const userID = useAppSelector(state => state.user.id);
	const display = useAppSelector(state => state.display);
	const { fitColMin, colorCellsByRating, tableZoom } = useAppSelector(state => state.settings);
	const { name: comparisonName } = useAppSelector(state => state.comparison);

	const [ctrlDown, setCtrlDown] = useState<boolean>(false);

	const displayRef = useRef<HTMLDivElement>(null);
	const tableRef = useRef<HTMLTableElement>(null);

	const dispatch = useAppDispatch();

	const onHomePath = usePathname() === '/';

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

		const { type, range, bestIndex, textRatingType, keyRatingPairs } = attribute;

		if ((value === null || value === undefined) && type !== 'score') return;

		switch (type) {
			case 'number':
				if (typeof value === 'number' && bestIndex !== null) {
					return getRatingFromRange(value, range, bestIndex);
				}
				return;
			case 'score':
				return rating ?? undefined;
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
			return 'var(--color-grey5)';
		}
		return ratingToColor(rating);
	};

	const handleCellClick = (entryID: number, attrID: number) => {
		if (!onHomePath) return;

		const entryIndex: number = entries.findIndex(entry => entry.id === entryID);
		dispatch(setMode('entries'));
		dispatch(setEditingIndex(entryIndex));
		dispatch(setEntryAttributeID(attrID));
	};

	const updateTableZoomInDB = async () => {
		if (!userID || !onHomePath) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setTableZoom`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userID: userID,
				tableZoom: tableZoom,
			}),
		});
		const data = await res.json();

		if (!data) {
			console.log('Could not update tableZoom in DB');
		}
	};

	const updateTableZoomInDBDebounce = useDebounceCallback(updateTableZoomInDB, 1000);

	const saveTableAsPDF = async () => {
		const tableEl = tableRef?.current as HTMLTableElement;
		if (!tableEl || !display.downloading || !attributes.length || !entries.length) return;
		const tableClone = tableEl.cloneNode(true) as HTMLTableElement;
		tableClone.style.breakInside = 'avoid';

		const thEls = tableClone.querySelectorAll('th');
		const tdEls = tableClone.querySelectorAll('td');
		const aEls = tableClone.querySelectorAll('a');

		for (const th of thEls) {
			th.style.color = 'black';
			th.style.padding = '0.1rem 0.2rem';
		}
		for (const td of tdEls) {
			td.style.color = 'black';
			td.style.padding = '0.1rem 0.2rem';
		}
		for (const a of aEls) a.style.color = '#0000FF';

		// const mod = await import('html2pdf.js');
		// const html2pdf = (mod as any).default || mod;

		// const opt = {
		// 	margin: 0.5,
		// 	filename: `${comparisonName}-table.pdf`,
		// 	image: { type: 'jpeg', quality: 0.98 },
		// 	html2canvas: { scale: 2 }, // Higher scale for better resolution
		// 	jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
		// 	pagebreak: {
		// 		mode: ['avoid-all', 'css', 'legacy'],
		// 	},
		// } as const;
		// html2pdf().set(opt).from(tableClone).save();

		const doc = new jsPDF({
			orientation: 'landscape',
			unit: 'pt',
			format: 'letter',
		});

		autoTable(doc, {
			html: tableClone,
			theme: 'grid',
			headStyles: { fillColor: '#424242' },
			styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
			margin: { top: 20, left: 10, right: 10, bottom: 10 },
			didParseCell: function (data) {
				// Optional: Enhance color parsing if needed (autoTable already handles inline background-color)
				if (
					data.cell.raw &&
					data.cell.raw instanceof HTMLTableCellElement &&
					data.cell.raw.style &&
					data.cell.raw.style.backgroundColor
				) {
					const color = data.cell.raw.style.backgroundColor; // e.g., 'rgb(26, 141, 0)'
					const rgb = color.match(/\d+/g)?.map(Number) as [number, number, number]; // Extract RGB
					if (rgb) data.cell.styles.fillColor = rgb;
					if (rgb) data.cell.styles.textColor = 'black';
				}
				// Make links blue/underlined if desired
				if (data.cell.raw && data.cell.raw instanceof HTMLTableCellElement && data.cell.raw.tagName === 'A') {
					data.cell.styles.textColor = [0, 0, 255];
					data.cell.text = [(data.cell.raw as HTMLTableCellElement).innerText]; // Just the link text
				}
			},
			didDrawPage: () => {
				const page = doc.getNumberOfPages();
				doc.setFontSize(9);
				doc.text(
					`Page ${page}`,
					doc.internal.pageSize.getWidth() - 20,
					doc.internal.pageSize.getHeight() - 8
				);
			},
		});

		doc.save(`${comparisonName}-table.pdf`);

		dispatch(setDownloading(false));
	};

	useEffect(() => {
		const displayEl = displayRef?.current as HTMLDivElement;
		if (!displayEl || !tableZoom) return;

		updateTableZoomInDBDebounce();

		displayEl.style.setProperty('--table-font-size', `calc(var(--table-font-size-default) * ${tableZoom}`);
	}, [tableZoom]);

	useEffect(() => {
		const displayEl = displayRef?.current as HTMLDivElement;
		if (!displayEl) return;

		calculateFinalRatings();

		const handleCtrlDown = (e: KeyboardEvent) => {
			if (e.key !== 'Control') return;
			setCtrlDown(true);
		};
		const handleCtrlUp = (e: KeyboardEvent) => {
			if (e.key !== 'Control') return;
			setCtrlDown(false);
		};
		const handleScrollZoom = (e: WheelEvent) => {
			if (!e.ctrlKey) return;
			e.preventDefault();
			const zoomInc = e.deltaY * 0.0005;
			dispatch(updateTableZoom(zoomInc));
		};

		document.addEventListener('keydown', handleCtrlDown);
		document.addEventListener('keyup', handleCtrlUp);
		displayEl.addEventListener('wheel', handleScrollZoom, true);

		return () => {
			document.removeEventListener('keydown', handleCtrlDown);
			document.removeEventListener('keyup', handleCtrlUp);
			displayEl.removeEventListener('wheel', handleScrollZoom, true);
		};
	}, []);

	useEffect(() => {
		calculateFinalRatings();
	}, [attributes, entries]);

	useEffect(() => {
		saveTableAsPDF();
	}, [display.downloading]);

	return (
		<div ref={displayRef} className={styles.table_display_container}>
			{attributes.length || entries.length ? (
				<table
					ref={tableRef}
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
												const { value, rating } = entry.cells[attr.id] || {};
												const { id: attrID, prefix, suffix, type } = attr || {};

												return (
													<td
														className={`${styles.cell} ${
															display.highlightedAttribute === attrID ? styles.highlighted : null
														}`}
														style={{
															backgroundColor:
																value !== '' && colorCellsByRating
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
														) : type === 'score' ? (
															rating
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
			) : null}
		</div>
	);
};

export default TableDisplay;
