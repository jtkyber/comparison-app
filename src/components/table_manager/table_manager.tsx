import { useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes';
import { IEntry } from '@/src/types/entries';
import { ActiveElement, TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEventHandler, useState } from 'react';
import AddElement from '../svg/element/add.svg';
import EditSVG from '../svg/element/edit.svg';
import VisibleSVG from '../svg/element/visible.svg';
import AttributeEdit from './modals/attribute_edit';
import styles from './table_manager.module.css';

const TableManager = () => {
	const [mode, setMode] = useState<TableManagerMode>('attributes');
	const [activeElement, setActiveElement] = useState<ActiveElement>(null);

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

	const handle_edit_element = (id: number): void => {
		switch (mode) {
			case 'attributes':
				const attribute: IAttribute | undefined = attributes.find(att => att.id === id);
				if (attribute !== undefined) setActiveElement(attribute);
				break;
			case 'entries':
				const entry: IEntry | undefined = entries.find(ent => ent.id === id);
				if (entry !== undefined) setActiveElement(entry);
				break;
		}
	};

	return (
		<>
			<div className={styles.table_manager_container}>
				<div className={styles.tool_section}>
					<div className={styles.left}></div>
					<div className={styles.right}>
						<div className={styles.add_element_btn}>
							<AddElement />
						</div>
					</div>
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
					<div className={styles.empty_space}></div>
				</div>

				<div className={styles.manager_section}>
					<div className={styles.element_list}>
						{(mode === 'attributes' ? attributes : entries).map(el => (
							<div key={el.id} className={styles.element}>
								<div className={styles.show_hide_btn}>
									<VisibleSVG />
								</div>
								<div onClick={() => handle_edit_element(el.id)} className={styles.edit_btn}>
									<EditSVG />
								</div>
								<h5 className={styles.name}>{el.name}</h5>
							</div>
						))}
					</div>
				</div>
			</div>

			{activeElement && mode === 'attributes' ? (
				<AttributeEdit attribute={activeElement as IAttribute} />
			) : null}
		</>
	);
};

export default TableManager;
