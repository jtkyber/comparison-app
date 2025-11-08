import { IAttribute } from '../types/attributes.types';

import {
	attributeValidationDefault,
	AttributeValidationKey,
	IAttributeValidation,
} from '../types/validation.types';

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
