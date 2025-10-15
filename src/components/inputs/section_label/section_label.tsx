import styles from './section_label.module.css';

const SectionLabel = ({ text, color }: { text: string; color: string }) => {
	return (
		<div className={styles.section_label_container}>
			<div style={{ borderBottom: `1px solid ${color}` }} className={styles.line}></div>

			<div className={styles.label_text_wrapper}>
				<h5 style={{ color: color }} className={styles.label_text}>
					{text}
				</h5>
			</div>
		</div>
	);
};

export default SectionLabel;
