import {
	addAttribute,
	addEntry,
	removeAttribute,
	setComparison,
} from '@/src/lib/features/comparison/comparisonSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEventHandler, useState } from 'react';
import AddSVG from '../svg/action_center/add.svg';
import CancelSVG from '../svg/action_center/cancel.svg';
import DeleteSVG from '../svg/action_center/delete.svg';
import SaveSVG from '../svg/action_center/save.svg';
import EditSVG from '../svg/element/edit.svg';
import SelectSVG from '../svg/element/select.svg';
import VisibleSVG from '../svg/element/visible.svg';
import Tooltip from '../tooltip/tooltip';
import AttributeEdit from './attribute_edit/attribute_edit';
import EntryEdit from './entry_edit/entry_edit';
import styles from './table_manager.module.css';

const defaultAttribute: IAttribute = {
	id: -1,
	name: '',
	prefix: '',
	suffix: '',
	type: 'text',
	range: [0, 100],
	bestIndex: 1,
	selfRated: true,
	importance: 10,
};

const defaultEntry: IEntry = {
	id: -1,
	name: '',
	values: {},
};

const TableManager = () => {
	const tooltipDelay: number = 800;

	const [mode, setMode] = useState<TableManagerMode>('attributes');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [idsChecked, setIdsChecked] = useState<number[]>([]);

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

	const handleEditElement = (index?: number): void => {
		switch (mode) {
			case 'attributes':
				if (index !== undefined) setEditingIndex(index);
				else {
					setEditingIndex(-1);
					dispatch(
						addAttribute({
							attribute: defaultAttribute,
							value: '',
						})
					);
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

	const refreshComparison = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/table`, {
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

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/addAttribute`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comparisonID: comparisonID,
				attribute: attributes[editingIndex >= 0 ? editingIndex : attributes.length - 1],
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

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/updateAttribute`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...attributes[editingIndex],
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

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/removeAttributes`, {
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

	const handleCancelEdit = async () => {
		let index = editingIndex;

		if (index === null) return;
		if (index === -1) index = attributes.length - 1;

		if (editingIndex === -1) {
			dispatch(removeAttribute(attributes[index].id));
		} else {
			await refreshComparison();
		}

		setEditingIndex(null);
	};

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

			<div className={styles.manager_section}>
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
					<div className={styles.element_list}>
						{(mode === 'attributes' ? attributes : entries).map((el, index) => (
							<div
								key={el.id}
								className={`${styles.element} ${idsChecked.includes(el.id) ? styles.checked : null}`}>
								<div
									onClick={() => handleElementSelect(el.id)}
									className={`${styles.select_btn} ${idsChecked.includes(el.id) ? styles.checked : null}`}>
									<SelectSVG />
								</div>
								<Tooltip text='Hide' key={`hide${el.id}`} delay={tooltipDelay}>
									<div className={styles.show_hide_btn}>
										<VisibleSVG />
									</div>
								</Tooltip>
								<Tooltip text='Edit' key={`edit${el.id}`} delay={tooltipDelay}>
									<div onClick={() => handleEditElement(index)} className={styles.edit_btn}>
										<EditSVG />
									</div>
								</Tooltip>
								<h5 className={styles.name}>{el.name}</h5>
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
									onClick={deleteAttributesInDB}
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
								<div
									onClick={() => handleCancelEdit()}
									className={`${styles.action_btn} ${styles.save_element_btn}`}>
									<CancelSVG />
								</div>
							</Tooltip>
							<Tooltip text='Save' key='save' delay={tooltipDelay}>
								<div
									onClick={() => (editingIndex === -1 ? addAttributeInDB() : updateAttributeInDB())}
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
