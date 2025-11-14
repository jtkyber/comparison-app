import {
	addAttribute,
	addEntry,
	removeAttribute,
	removeEntry,
	setComparison,
	setNewAttributeIndex,
	setNewEntryIndex,
} from '@/src/lib/features/comparison/comparisonSlice';
import { setEditingIndex, setMode } from '@/src/lib/features/comparison/managerSlice';
import { setManagerWidth } from '@/src/lib/features/user/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import {
	attributeValidationDefault,
	IAttributeValidation,
	IEntryValidation,
} from '@/src/types/validation.types';
import { endpoints } from '@/src/utils/api_calls';
import { validateAttribute, validateEntry } from '@/src/validation/table_manager.val';
import { Fragment, MouseEventHandler, useEffect, useRef, useState } from 'react';
import AddSVG from '../svg/action_center/add.svg';
import CancelSVG from '../svg/action_center/cancel.svg';
import DeleteSVG from '../svg/action_center/delete.svg';
import SaveSVG from '../svg/action_center/save.svg';
import Tooltip from '../tooltip/tooltip';
import AttributeEdit from './attribute_edit/attribute_edit';
import ManagerElement from './element/manager_element';
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
	const [idsChecked, setIdsChecked] = useState<number[]>([]);
	const [draggingID, setDraggingID] = useState<number>(0);
	const [resizing, setResizing] = useState<boolean>(false);
	const [attributeValidation, setAttributeValidation] = useState<IAttributeValidation>({
		...attributeValidationDefault,
	});
	const [entryValidation, setEntryValidation] = useState<IEntryValidation>({
		name: null,
		cells: {},
	});

	const draggingRef = useRef<HTMLDivElement>(null);
	const managerContainerRef = useRef<HTMLDivElement>(null);
	const managerSectionRef = useRef<HTMLDivElement>(null);
	const elementListRef = useRef<HTMLDivElement>(null);

	const { id: userID } = useAppSelector(state => state.user);
	const { id: comparisonID, attributes, entries } = useAppSelector(state => state.comparison);
	const { mode, editingIndex } = useAppSelector(state => state.manager);
	const { managerWidth } = useAppSelector(state => state.settings);

	const dispatch = useAppDispatch();

	const switchMode: MouseEventHandler<HTMLButtonElement> = e => {
		if (editingIndex !== null) return;

		const id: string = (e.target as HTMLButtonElement).id;

		switch (id) {
			case 'attributes_tab':
				dispatch(setMode('attributes'));
				break;
			case 'entries_tab':
				dispatch(setMode('entries'));
				break;
		}
	};

	const handleEditElement = (index?: number): void => {
		switch (mode) {
			case 'attributes':
				if (index !== undefined) dispatch(setEditingIndex(index));
				else {
					dispatch(setEditingIndex(-1));
					dispatch(addAttribute(defaultAttribute));
				}
				break;
			case 'entries':
				if (index !== undefined) dispatch(setEditingIndex(index));
				else {
					dispatch(setEditingIndex(-1));
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
		const table = await endpoints.comparisons.getTable(comparisonID);

		dispatch(
			setComparison({
				id: table.id,
				name: table.name,
				attributes: table.attributes,
				entries: table.entries,
			})
		);
	};

	const addAttributeInDB = async () => {
		if (editingIndex === null) return;

		const attr = attributes[editingIndex >= 0 ? editingIndex : attributes.length - 1];
		const val = validateAttribute(attr, true);
		if (!val.isValid) {
			setAttributeValidation(val.valObj);
			return;
		}

		await endpoints.attributes.add(comparisonID, attr);
		await refreshComparison();

		dispatch(setEditingIndex(null));
	};

	const addEntryInDB = async () => {
		if (editingIndex === null) return;

		const entry = entries[editingIndex >= 0 ? editingIndex : entries.length - 1];
		const val = validateEntry(entry, attributes, true);
		if (!val.isValid) {
			setEntryValidation(val.valObj);
			return;
		}

		await endpoints.entries.add(comparisonID, entry);
		await refreshComparison();

		dispatch(setEditingIndex(null));
	};

	const updateAttributeInDB = async () => {
		if (editingIndex === null) return;

		const attr = attributes[editingIndex];
		const val = validateAttribute(attr, true);

		if (!val.isValid) {
			setAttributeValidation(val.valObj);
			return;
		}

		await endpoints.attributes.update(comparisonID, attr);
		await refreshComparison();

		dispatch(setEditingIndex(null));
	};

	const updateEntryInDB = async () => {
		if (editingIndex === null) return;

		const entry = entries[editingIndex];

		const val = validateEntry(entry, attributes, true);
		if (!val.isValid) {
			setEntryValidation(val.valObj);
			return;
		}

		await endpoints.entries.update(comparisonID, entry);
		await refreshComparison();

		dispatch(setEditingIndex(null));
	};

	const deleteAttributesInDB = async () => {
		if (editingIndex !== null) return;

		await endpoints.attributes.delete(comparisonID, idsChecked);
		await refreshComparison();

		setIdsChecked([]);
	};

	const deleteEntriesInDB = async () => {
		if (editingIndex !== null) return;

		await endpoints.entries.delete(comparisonID, idsChecked);
		await refreshComparison();

		setIdsChecked([]);
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

		dispatch(setEditingIndex(null));
	};

	const moveAttributeInDB = async (id: number) => {
		const indexOfMoved: number = attributes.findIndex(attr => attr.id == id);

		await endpoints.attributes.move(comparisonID, id, indexOfMoved);
		await refreshComparison();
	};

	const moveEntryInDB = async (id: number) => {
		const indexOfMoved: number = entries.findIndex(entry => entry.id == id);

		await endpoints.entries.move(comparisonID, id, indexOfMoved);
		await refreshComparison();
	};

	const updateManagerWidthInDB = async (w: number) => {
		await endpoints.settings.managerWidth.set(userID, w);
		dispatch(setManagerWidth(w));
	};

	const handleElementMouseDown = (e: React.MouseEvent, id: number): void => {
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
		const managerContainer = managerContainerRef?.current;
		if (resizing && managerContainer) {
			setResizing(false);
			updateManagerWidthInDB(managerContainer.getBoundingClientRect().width);
		}

		const target = draggingRef?.current;
		if (!target) return;

		target.style.position = '';
		target.style.zIndex = '0';
		draggingRef.current = null;

		const dragginIDCopy = draggingID;
		setDraggingID(0);

		switch (mode) {
			case 'attributes':
				moveAttributeInDB(dragginIDCopy);
				break;
			case 'entries':
				moveEntryInDB(dragginIDCopy);
				break;
		}
	};

	const handleManagerMouseMove = (e: React.MouseEvent) => {
		const target = draggingRef?.current;
		const elementList = elementListRef?.current;

		if (!draggingID || resizing || !target || !elementList) return;
		const index: number = parseInt(target.id);

		const offset: number =
			elementList.getBoundingClientRect().top + target.getBoundingClientRect().height / 2;

		const newTargetYPos = e.clientY - offset;

		target.style.top = `${newTargetYPos}px`;

		// Determine el position in array based on visual position
		const otherElements = Array.from(elementList.children).filter(el => el !== target && el.id !== 'temp_el');
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

	const handleMouseMove = (e: MouseEvent) => {
		const managerContainer = managerContainerRef?.current;

		if (resizing && managerContainer) {
			const x = e.clientX;
			managerContainer.style.setProperty('width', `${x}px`);
		}
	};

	const handleResizerMouseDown = () => setResizing(true);

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [draggingID, attributes, entries, resizing, managerContainerRef.current]);

	useEffect(() => {
		dispatch(setEditingIndex(null));
		setIdsChecked([]);
	}, [comparisonID]);

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [resizing, managerContainerRef.current]);

	useEffect(() => {
		const managerContainer = managerContainerRef?.current;
		if (managerWidth && managerContainer) {
			managerContainer.style.setProperty('width', `${managerWidth}px`);
		}
	}, [managerContainerRef?.current]);

	return (
		<div
			ref={managerContainerRef}
			className={`${styles.table_manager_container} ${
				comparisonID === 0 || resizing ? styles.disabled : null
			}`}>
			<div onMouseDown={handleResizerMouseDown} className={styles.resizer}></div>

			<div className={styles.manager_title_section}>
				<h4 className={styles.manager_title}>Manager</h4>
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

			<div ref={managerSectionRef} onMouseMove={handleManagerMouseMove} className={styles.manager_section}>
				{editingIndex !== null && mode === 'attributes' ? (
					<div className={styles.element_editor_section}>
						<div className={styles.element_editor_title_wrapper}>
							<div className={styles.element_editor_title_shape}></div>
							<h4 className={styles.element_editor_title}>
								{editingIndex >= 0 ? 'Edit Attribute' : 'Add New Attribute'}
							</h4>
						</div>
						<AttributeEdit validation={attributeValidation} setValidation={setAttributeValidation} />
					</div>
				) : editingIndex !== null && mode === 'entries' ? (
					<div className={styles.element_editor_section}>
						<div className={styles.element_editor_title_wrapper}>
							<div className={styles.element_editor_title_shape}></div>
							<h4 className={styles.element_editor_title}>
								{editingIndex >= 0 ? 'Edit Entry' : 'Add New Entry'}
							</h4>
						</div>
						<EntryEdit validation={entryValidation} setValidation={setEntryValidation} />
					</div>
				) : (
					<div ref={elementListRef} className={styles.element_list}>
						{(mode === 'attributes' ? attributes : entries).length ? (
							(mode === 'attributes' ? attributes : entries).map((el, index) => (
								<Fragment key={el.id}>
									<ManagerElement
										el={el}
										index={index}
										idsChecked={idsChecked}
										mode={mode}
										handleElementSelect={handleElementSelect}
										handleEditElement={handleEditElement}
										handleElementMouseDown={handleElementMouseDown}
									/>
									{el.id === draggingID ? (
										<div id='temp_el' key={el.id + '_temp'} className={styles.container}></div>
									) : null}
								</Fragment>
							))
						) : (
							<h4 className={styles.no_element_text}>
								{mode === 'attributes'
									? "One of these will hold information for a spec, feature or quality that'll be used to compare entries. Each entry's value will be compared against it's respective attribute information to generate a rating for that cell. All of those ratings will be combined into a final score for each entry. Click the plus button below to add your first attribute."
									: "These are the options (rows) you'll be comparing against eachother. Click the plus button below to add your first entry."}
							</h4>
						)}
					</div>
				)}
			</div>

			<div className={styles.action_section}>
				<div className={styles.actions_left}>
					{editingIndex === null && idsChecked.length ? (
						<>
							<Tooltip text='Delete' key='delete' delay='default'>
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
							<Tooltip text='Add' key='add' delay='default'>
								<div
									onClick={() => handleEditElement()}
									className={`${styles.action_btn} ${styles.add_element_btn}`}>
									<AddSVG />
								</div>
							</Tooltip>
						</>
					) : (
						<>
							<Tooltip text='Cancel' key='cancel' delay='default'>
								<div onClick={handleCancelEdit} className={`${styles.action_btn} ${styles.save_element_btn}`}>
									<CancelSVG />
								</div>
							</Tooltip>
							<Tooltip text='Save' key='save' delay='default'>
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
