import {
	addAttribute,
	addEntry,
	removeAttribute,
	removeEntry,
	setComparison,
	setNewAttributeIndex,
	setNewEntryIndex,
	toggleAttributeHidden,
	toggleEntryHidden,
} from '@/src/lib/features/comparison/comparisonSlice';
import { setHighlightedAttribute, setHighlightedEntry } from '@/src/lib/features/comparison/displaySlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEvent, MouseEventHandler, useEffect, useRef, useState } from 'react';
import AddSVG from '../svg/action_center/add.svg';
import CancelSVG from '../svg/action_center/cancel.svg';
import DeleteSVG from '../svg/action_center/delete.svg';
import SaveSVG from '../svg/action_center/save.svg';
import EditSVG from '../svg/element/edit.svg';
import HiddenSVG from '../svg/element/hidden.svg';
import SelectSVG from '../svg/element/select.svg';
import VisibleSVG from '../svg/element/visible.svg';
import Tooltip from '../tooltip/tooltip';
import AttributeEdit from './attribute_edit/attribute_edit';
import EntryEdit from './entry_edit/entry_edit';
import styles from './table_manager.module.css';

const defaultAttribute: IAttribute = {
	id: -1,
	pos: -1,
	name: '',
	hidden: false,
	prefix: '',
	suffix: '',
	type: 'text',
	range: [0, 100],
	bestIndex: 1,
	textRatingType: 'none',
	keyRatingPairs: [],
	importance: 10,
};

const defaultEntry: IEntry = {
	id: -1,
	pos: -1,
	name: '',
	hidden: false,
	cells: {},
};

const TableManager = () => {
	const tooltipDelay: number = 800;

	const [mode, setMode] = useState<TableManagerMode>('attributes');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [idsChecked, setIdsChecked] = useState<number[]>([]);
	const [draggingID, setDraggingID] = useState<number>(0);

	const draggingRef = useRef<HTMLDivElement>(null);
	const managerSectionRef = useRef<HTMLDivElement>(null);
	const elementListRef = useRef<HTMLDivElement>(null);

	const comparisonID = useAppSelector(state => state.comparison.id);
	const attributes = useAppSelector(state => state.comparison.attributes);
	const entries = useAppSelector(state => state.comparison.entries);

	const dispatch = useAppDispatch();

	const switchMode: MouseEventHandler<HTMLButtonElement> = e => {
		if (editingIndex !== null) return;

		const id: string = (e.target as HTMLButtonElement).id;

		switch (id) {
			case 'attributes_tab':
				setMode('attributes');
				break;
			case 'entries_tab':
				setMode('entries');
				break;
		}
	};

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

	const handleEditElement = (index?: number): void => {
		switch (mode) {
			case 'attributes':
				if (index !== undefined) setEditingIndex(index);
				else {
					setEditingIndex(-1);
					dispatch(addAttribute(defaultAttribute));
				}
				break;
			case 'entries':
				if (index !== undefined) setEditingIndex(index);
				else {
					setEditingIndex(-1);
					dispatch(addEntry(defaultEntry));
				}
				break;
		}
	};

	const handleElementSelect = (elementID: number): void => {
		if (idsChecked.includes(elementID)) {
			setIdsChecked(idsChecked.filter(id => id !== elementID));
		} else setIdsChecked([...idsChecked, elementID]);
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

	const refreshComparison = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/table`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
			}),
		});

		const data = await res.json();

		dispatch(
			setComparison({
				id: data.id,
				name: data.name,
				attributes: data.attributes,
				entries: data.entries,
			})
		);
	};

	const addAttributeInDB = async () => {
		if (editingIndex === null) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/addAttribute`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				attribute: attributes[editingIndex >= 0 ? editingIndex : attributes.length - 1],
			}),
		});

		const data = (await res.json()) as IAttribute;

		if (data) {
			await refreshComparison();

			setEditingIndex(null);
		}
	};

	const addEntryInDB = async () => {
		if (editingIndex === null) return;

		const entry = entries[editingIndex >= 0 ? editingIndex : entries.length - 1];

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/addEntry`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				entry: entry,
			}),
		});

		const data = await res.json();

		if (data) {
			await refreshComparison();
			setEditingIndex(null);
		}
	};

	const updateAttributeInDB = async () => {
		if (editingIndex === null) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/updateAttribute`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				attribute: attributes[editingIndex],
			}),
		});

		const data = await res.json();

		if (data) {
			await refreshComparison();

			setEditingIndex(null);
		}
	};

	const updateEntryInDB = async () => {
		if (editingIndex === null) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/updateEntry`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				entry: entries[editingIndex],
			}),
		});

		const data = await res.json();

		if (data) {
			await refreshComparison();

			setEditingIndex(null);
		}
	};

	const deleteAttributesInDB = async () => {
		if (editingIndex !== null) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/removeAttributes`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				attributeIDs: idsChecked,
			}),
		});

		const data = await res.json();

		if (data) {
			await refreshComparison();

			setIdsChecked([]);
		}
	};

	const deleteEntriesInDB = async () => {
		if (editingIndex !== null) return;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/removeEntries`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				entryIDs: idsChecked,
			}),
		});

		const data = await res.json();

		if (data) {
			await refreshComparison();

			setIdsChecked([]);
		}
	};

	const handleCancelEdit = async () => {
		if (editingIndex === null) return;

		if (editingIndex === -1) {
			mode === 'attributes'
				? dispatch(removeAttribute(attributes[attributes.length - 1].id))
				: dispatch(removeEntry(entries[entries.length - 1].id));
		} else {
			await refreshComparison();
		}

		setEditingIndex(null);
	};

	const moveAttributeInDB = async () => {
		const indexOfMoved: number = attributes.findIndex(attr => attr.id == draggingID);

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/moveAttribute`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				attributeID: draggingID,
				newAttrPos: indexOfMoved,
			}),
		});

		const data = await res.json();

		if (data) {
			setDraggingID(0);
			await refreshComparison();
		}
	};

	const moveEntryInDB = async () => {
		const indexOfMoved: number = entries.findIndex(entry => entry.id == draggingID);
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/moveEntry`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				entryID: draggingID,
				newEntryPos: indexOfMoved,
			}),
		});

		const data = await res.json();

		if (data) {
			setDraggingID(0);
			await refreshComparison();
		}
	};

	const handleElementMouseDown = (e: MouseEvent<HTMLHeadingElement>, id: number): void => {
		let target = e?.target as HTMLHeadingElement;
		target = target.parentElement as HTMLDivElement;
		const managerSectionEl = managerSectionRef?.current;

		if (!(target && managerSectionEl)) return;

		const offset: number =
			managerSectionEl.getBoundingClientRect().top + target.getBoundingClientRect().height / 2;

		const newTargetYPos = e.clientY - offset;

		target.style.position = 'absolute';
		target.style.top = `${newTargetYPos}px`;
		target.style.zIndex = '1';
		draggingRef.current = target;

		setDraggingID(id);
	};

	const handleMouseUp = (): void => {
		const target = draggingRef?.current;
		if (!target) return;

		target.style.position = '';
		target.style.zIndex = '0';
		draggingRef.current = null;

		switch (mode) {
			case 'attributes':
				moveAttributeInDB();
				break;
			case 'entries':
				moveEntryInDB();
				break;
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		const target = draggingRef?.current;
		const elementList = elementListRef?.current;

		if (!(draggingID && target && elementList)) return;
		const index: number = parseInt(target.id);

		const offset: number =
			elementList.getBoundingClientRect().top + target.getBoundingClientRect().height / 2;

		const newTargetYPos = e.clientY - offset;

		target.style.top = `${newTargetYPos}px`;

		// Determine el position in array based on visual position
		const otherElements = Array.from(elementList.children).filter(el => el !== target);
		let arrayPos: number = -1;
		for (let i = 0; i < otherElements.length; i++) {
			const element = otherElements[i];
			const elementYPos: number =
				element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;

			if (e.clientY < elementYPos) {
				arrayPos = i;
				break;
			}
		}
		if (arrayPos === -1) arrayPos = otherElements.length;

		if (arrayPos !== index) {
			switch (mode) {
				case 'attributes':
					dispatch(setNewAttributeIndex({ to: arrayPos, from: index }));
					break;
				case 'entries':
					dispatch(setNewEntryIndex({ to: arrayPos, from: index }));
					break;
			}
		}
	};

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [draggingID, attributes, entries]);

	return (
		<div className={`${styles.table_manager_container} ${comparisonID === 0 ? styles.disabled : null}`}>
			<div className={styles.manager_title_section}>
				<h4 className={styles.manager_title}>Comparison Manager</h4>
			</div>

			<div className={styles.tab_section}>
				<button
					id='attributes_tab'
					onClick={switchMode}
					className={`${styles.tab} ${mode === 'attributes' ? styles.active : null}`}>
					Attributes
				</button>
				<button
					id='entries_tab'
					onClick={switchMode}
					className={`${styles.tab} ${mode === 'entries' ? styles.active : null}`}>
					Entries
				</button>
				<div className={styles.tab_section_fill}></div>
			</div>

			<div ref={managerSectionRef} onMouseMove={handleMouseMove} className={styles.manager_section}>
				{editingIndex !== null && mode === 'attributes' ? (
					<div className={styles.element_editor_section}>
						<div className={styles.element_editor_title_wrapper}>
							<div className={styles.element_editor_title_shape}></div>
							<h4 className={styles.element_editor_title}>
								{editingIndex >= 0 ? 'Edit Attribute' : 'Add New Attribute'}
							</h4>
						</div>
						{editingIndex >= 0 ? (
							<AttributeEdit attributeIndex={editingIndex} />
						) : (
							<AttributeEdit attributeIndex={attributes.length - 1} />
						)}
					</div>
				) : editingIndex !== null && mode === 'entries' ? (
					<div className={styles.element_editor_section}>
						<div className={styles.element_editor_title_wrapper}>
							<div className={styles.element_editor_title_shape}></div>
							<h4 className={styles.element_editor_title}>
								{editingIndex >= 0 ? 'Edit Entry' : 'Add New Entry'}
							</h4>
						</div>
						{editingIndex >= 0 ? (
							<EntryEdit entryIndex={editingIndex} />
						) : (
							<EntryEdit entryIndex={entries.length - 1} />
						)}
					</div>
				) : (
					<div ref={elementListRef} className={styles.element_list}>
						{(mode === 'attributes' ? attributes : entries).map((el, index) => (
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
						))}
					</div>
				)}
			</div>

			<div className={styles.action_section}>
				<div className={styles.actions_left}>
					{editingIndex === null && idsChecked.length ? (
						<>
							<Tooltip text='Delete' key='delete' delay={tooltipDelay}>
								<div
									onClick={mode === 'attributes' ? deleteAttributesInDB : deleteEntriesInDB}
									className={`${styles.action_btn} ${styles.delete_element_btn}`}>
									<DeleteSVG />
								</div>
							</Tooltip>
						</>
					) : null}
				</div>
				<div className={styles.actions_right}>
					{editingIndex === null ? (
						<>
							<Tooltip text='Add' key='add' delay={tooltipDelay}>
								<div
									onClick={() => handleEditElement()}
									className={`${styles.action_btn} ${styles.add_element_btn}`}>
									<AddSVG />
								</div>
							</Tooltip>
						</>
					) : (
						<>
							<Tooltip text='Cancel' key='cancel' delay={tooltipDelay}>
								<div onClick={handleCancelEdit} className={`${styles.action_btn} ${styles.save_element_btn}`}>
									<CancelSVG />
								</div>
							</Tooltip>
							<Tooltip text='Save' key='save' delay={tooltipDelay}>
								<div
									onClick={() =>
										mode === 'attributes'
											? editingIndex === -1
												? addAttributeInDB()
												: updateAttributeInDB()
											: editingIndex === -1
											? addEntryInDB()
											: updateEntryInDB()
									}
									className={`${styles.action_btn} ${styles.save_element_btn}`}>
									<SaveSVG />
								</div>
							</Tooltip>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default TableManager;
