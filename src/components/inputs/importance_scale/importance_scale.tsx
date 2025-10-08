import styles from './importance_scale.module.css';

import React from 'react';

const ImportanceScale = () => {
	return (
		<div className={styles.importance_scale_container}>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
			<div className={styles.importance_bar}></div>
		</div>
	);
};

export default ImportanceScale;
