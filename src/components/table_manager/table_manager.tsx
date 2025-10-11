import { useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEventHandler, useState } from 'react';
import AddElement from '../svg/element/add.svg';
import EditSVG from '../svg/element/edit.svg';
import VisibleSVG from '../svg/element/visible.svg';
import AttributeEdit from './modals/attribute_edit/attribute_edit';
import styles from './table_manager.module.css';

const TableManager = () => {
	const [mode, setMode] = useState<TableManagerMode>('attributes');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const attributes = useAppSelector(state => state.attributes);
	const entries = useAppSelector(state => state.entries);

	const switchMode: MouseEventHandler<HTMLButtonElement> = e => {
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

	const handle_edit_element = (index?: number): void => {
		switch (mode) {
			case 'attributes':
				if (index !== undefined) setEditingIndex(index);
				else setEditingIndex(-1);
				break;
			case 'entries':
				if (index !== undefined) setEditingIndex(index);
				else setEditingIndex(-1);
				break;
		}
	};

	return (
		<div className={styles.table_manager_container}>
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
			</div>

			<div className={styles.manager_section}>
				{editingIndex !== null && mode === 'attributes' ? (
					<div className={styles.element_editor_section}>
						<h3 className={styles.element_editor_title}>
							{editingIndex >= 0 ? 'Edit Attribute' : 'Add New Attribute'}
						</h3>
						<AttributeEdit
							attribute={attributes[editingIndex >= 0 ? editingIndex : attributes.length] as IAttribute}
						/>
					</div>
				) : (
					<div className={styles.element_list}>
						{(mode === 'attributes' ? attributes : entries).map((el, index) => (
							<div key={el.id} className={styles.element}>
								<div className={styles.show_hide_btn}>
									<VisibleSVG />
								</div>
								<div onClick={() => handle_edit_element(index)} className={styles.edit_btn}>
									<EditSVG />
								</div>
								<h5 className={styles.name}>{el.name}</h5>
							</div>
						))}
					</div>
				)}
			</div>

			<div className={styles.action_section}>
				<div className={styles.actions_left}></div>
				<div className={styles.actions_right}>
					<div onClick={() => handle_edit_element()} className={styles.add_element_btn}>
						<AddElement />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TableManager;
