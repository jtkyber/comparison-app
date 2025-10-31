import { toggleAttributeHidden, toggleEntryHidden } from '@/src/lib/features/comparison/comparisonSlice';
import { setHighlightedAttribute, setHighlightedEntry } from '@/src/lib/features/comparison/displaySlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEvent } from 'react';
import EditSVG from '../../svg/element/edit.svg';
import HiddenSVG from '../../svg/element/hidden.svg';
import SelectSVG from '../../svg/element/select.svg';
import VisibleSVG from '../../svg/element/visible.svg';
import Tooltip from '../../tooltip/tooltip';
import styles from '../table_manager.module.css';

const ManagerElement = ({
	el,
	index,
	idsChecked,
	mode,
	handleElementSelect,
	handleEditElement,
	handleElementMouseDown,
}: {
	el: IAttribute | IEntry;
	index: number;
	idsChecked: number[];
	mode: TableManagerMode;
	handleElementSelect: (elementID: number) => void;
	handleEditElement: (index?: number) => void;
	handleElementMouseDown: (e: MouseEvent<HTMLHeadingElement>, id: number) => void;
}) => {
	const tooltipDelay: number = 800;

	const dispatch = useAppDispatch();

	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);

	const handleElementHover = (elementID: number): void => {
		switch (mode) {
			case 'attributes':
				dispatch(setHighlightedAttribute(elementID));
				break;
			case 'entries':
				dispatch(setHighlightedEntry(elementID));
				break;
		}
	};

	const handleElementLeave = (): void => {
		switch (mode) {
			case 'attributes':
				dispatch(setHighlightedAttribute(0));
				break;
			case 'entries':
				dispatch(setHighlightedEntry(0));
				break;
		}
	};

	const handleAttributeHideToggle = async (index: number): Promise<void> => {
		dispatch(toggleAttributeHidden(index));

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/toggleAttributeHidden`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: attributes[index].id,
			}),
		});

		await res.json();
	};

	const handleEntryHideToggle = async (index: number): Promise<void> => {
		dispatch(toggleEntryHidden(index));

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/toggleEntryHidden`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: entries[index].id,
			}),
		});

		await res.json();
	};

	return (
		<div
			key={el.id}
			id={index.toString()}
			className={`${styles.element} ${idsChecked.includes(el.id) ? styles.checked : null} ${
				el.hidden ? styles.hidden : null
			}`}
			onMouseOver={() => handleElementHover(el.id)}
			onMouseLeave={handleElementLeave}
			style={{}}>
			<Tooltip
				text={idsChecked.includes(el.id) ? 'Deselect' : 'Select'}
				key={`select${el.id}`}
				delay={tooltipDelay}>
				<div
					onClick={() => handleElementSelect(el.id)}
					className={`${styles.select_btn} ${idsChecked.includes(el.id) ? styles.checked : null}`}>
					<SelectSVG />
				</div>
			</Tooltip>
			<Tooltip text={el.hidden ? 'Show' : 'Hide'} key={`hide${el.id}`} delay={tooltipDelay}>
				<div
					onClick={() =>
						mode === 'attributes' ? handleAttributeHideToggle(index) : handleEntryHideToggle(index)
					}
					className={styles.show_hide_btn}>
					{el.hidden ? <HiddenSVG /> : <VisibleSVG />}
				</div>
			</Tooltip>
			<Tooltip text='Edit' key={`edit${el.id}`} delay={tooltipDelay}>
				<div onClick={() => handleEditElement(index)} className={styles.edit_btn}>
					<EditSVG />
				</div>
			</Tooltip>
			<h5 onMouseDown={e => handleElementMouseDown(e, el.id)} className={styles.name}>
				{el.name}
			</h5>
		</div>
	);
};

export default ManagerElement;
