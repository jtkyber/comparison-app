import styles from './section_label.module.css';

const SectionLabel = ({ text }: { text: string }) => {
	return (
		<div className={styles.section_label_container}>
			<div className={styles.line}></div>

			<div className={styles.label_text_wrapper}>
				<h5 className={styles.label_text}>{text}</h5>
			</div>
		</div>
	);
};

export default SectionLabel;
