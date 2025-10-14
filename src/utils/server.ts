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
