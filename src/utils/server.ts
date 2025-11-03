import { attributeInterfaceKeys, IAttribute } from '../types/attributes.types';

export function toCamelAttribute(o: Partial<IAttribute>): Partial<IAttribute> {
	const object: any = { ...o };

	for (const key in object) {
		const valueCopy = object[key];
		const newKey = attributeInterfaceKeys.find(k => k.toLowerCase() === key.toLowerCase());
		if (newKey === undefined || newKey === key) continue;
		object[newKey] = valueCopy;

		delete object[key];
	}

	return object;
}

export function underscoreToCamelObject(o: object): object {
	const object: any = { ...o };

	for (const key in object) {
		const valueCopy = object[key];
		const newKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
		if (newKey === undefined || newKey === key) continue;
		object[newKey] = valueCopy;

		delete object[key];
	}

	return object;
}
