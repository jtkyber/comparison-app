import { IAttribute } from '../types/attributes.types';
import { IEntry } from '../types/entries.types';
import {
	attributeValidationDefault,
	IAttributeValidation,
	IEntryValidation,
} from '../types/validation.types';
import { isNothing, isValidURL } from '../utils/general';

export function validateAttribute(
	attribute: IAttribute,
	finalCheck?: boolean
): {
	valObj: IAttributeValidation;
	isValid: boolean;
} {
	const { name, prefix, suffix, type, range, keyRatingPairs } = attribute;
	const val: IAttributeValidation = { ...attributeValidationDefault };
	let isValid = true;

	if (name.length > 36) {
		val.name = 'Name must be under 36 characters';
		isValid = false;
	} else if (finalCheck && !name.length) {
		val.name = 'Name must be at least 1 character';
		isValid = false;
	}

	if (prefix && prefix.length > 36) {
		val.prefix = 'Prefix must be under 36 characters';
		isValid = false;
	}

	if (suffix && suffix.length > 36) {
		val.suffix = 'Suffix must be under 36 characters';
		isValid = false;
	}

	switch (type) {
		case 'number':
			if (range[0] >= range[1] || (range[2] && range[1] >= range[2])) {
				val.rangeValues = 'Range values must be in ascending order';
				isValid = false;
			}
			break;
		case 'text':
			for (const pair of keyRatingPairs) {
				const key = pair.key;
				if (key.length > 36) {
					val.pairName = 'Names must be under 36 characters';
					isValid = false;
					break;
				} else if (finalCheck && !key.length) {
					val.pairName = 'Names must be at least 1 character';
					isValid = false;
					break;
				}
			}
			break;
	}

	return {
		valObj: val,
		isValid: isValid,
	};
}

export function validateEntry(
	entry: IEntry,
	attributes: IAttribute[],
	finalCheck?: boolean
): {
	valObj: IEntryValidation;
	isValid: boolean;
} {
	const { name, cells } = entry;
	const val: IEntryValidation = { name: null, cells: {} };

	let isValid = true;

	if (name.length > 36) {
		val.name = 'Name must be under 36 characters';
		isValid = false;
	} else if (finalCheck && !name.length) {
		val.name = 'Name must be at least 1 character';
		isValid = false;
	}

	for (const attr of attributes) {
		const { id: attrID, type } = attr;
		const cellValue = cells[attrID]?.value;

		switch (type) {
			case 'number':
				if (finalCheck && isNothing(cellValue)) {
					val.cells[attrID] = 'Please enter a number';
					isValid = false;
				} else if (!isNothing(cellValue) && typeof cellValue !== 'number') {
					val.cells[attrID] = 'Value must be a number';
					isValid = false;
				} else if (!isNothing(cellValue) && cellValue.toString().length > 36) {
					val.cells[attrID] = 'Value must be between 1 and 36 characters';
					isValid = false;
				}
				break;
			case 'yesNo':
				if (finalCheck && (isNothing(cellValue) || typeof cellValue !== 'boolean')) {
					val.cells[attrID] = 'Please select an option';
					isValid = false;
				}
				break;
			case 'text':
				if (finalCheck && isNothing(cellValue)) {
					val.cells[attrID] = 'Please enter a value';
					isValid = false;
				} else if (typeof cellValue === 'string' && cellValue.length > 36) {
					val.cells[attrID] = 'Value must be between 1 and 36 characters';
					isValid = false;
				}
				break;
			case 'link':
				if (finalCheck && isNothing(cellValue)) {
					val.cells[attrID] = 'Please enter a valid URL';
					isValid = false;
				} else if (typeof cellValue === 'string' && !isValidURL(cellValue)) {
					val.cells[attrID] = 'The value you entered is not a valid URL';
					isValid = false;
				}
				break;
		}
	}

	return {
		valObj: val,
		isValid: isValid,
	};
}
