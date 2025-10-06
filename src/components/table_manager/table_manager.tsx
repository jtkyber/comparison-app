import { TableManagerMode } from '@/src/types/table_manager.types';
import React, { useState } from 'react';
import styles from './table_manager.module.css';

const TableManager = () => {
	const [mode, setMode] = useState<TableManagerMode>('attributes');

	return <div className={styles.table_manager_container}></div>;
};

export default TableManager;
