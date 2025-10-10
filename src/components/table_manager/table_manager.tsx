import { useAppSelector } from '@/src/lib/hooks';
import { IAttribute } from '@/src/types/attributes.types';
import { IEntry } from '@/src/types/entries.types';
import { ActiveElement, TableManagerMode } from '@/src/types/table_manager.types';
import React, { MouseEventHandler, useState } from 'react';
import AddElement from '../svg/element/add.svg';
import EditSVG from '../svg/element/edit.svg';
import VisibleSVG from '../svg/element/visible.svg';
import AttributeEdit from './modals/attribute_edit/attribute_edit';
import styles from './table_manager.module.css';

const attributeDefault: IAttribute = {
	id: -1,
	name: '',
	importance: null,
	type: 'text',
	data: '',
	prefix: null,
	suffix: null,
	rangeBest: null,
	selfRated: false,
};

const entryDefault: IEntry = {
	id: -1,
	name: '',
	values: {},
};

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

	const handle_edit_element = (id?: number): void => {
		switch (mode) {
			case 'attributes':
				if (id) {
					const attribute: IAttribute | undefined = attributes.find(att => att.id === id);
					if (attribute !== undefined) setActiveElement(attribute);
				} else setActiveElement(attributeDefault);

				break;
			case 'entries':
				if (id) {
					const entry: IEntry | undefined = entries.find(ent => ent.id === id);
					if (entry !== undefined) setActiveElement(entry);
				} else setActiveElement(entryDefault);
				break;
		}
	};

	return (
		<>
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
					<div className={styles.tool_section}>
						<div onClick={() => handle_edit_element()} className={styles.add_element_btn}>
							<AddElement />
						</div>
					</div>
				</div>

				<div className={styles.manager_section}>
					{activeElement && mode === 'attributes' ? (
						<AttributeEdit attribute={activeElement as IAttribute} />
					) : (
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
					)}
				</div>
			</div>

			{/* {activeElement && mode === 'attributes' ? (
				<AttributeEdit attribute={activeElement as IAttribute} />
			) : null} */}
		</>
	);
};

export default TableManager;
