export const attributeTypeList = ['number', 'yesNo', 'text', 'link'] as const;
export const attributeTypeListDisplayed = {
	number: 'Number',
	yesNo: 'Yes / No',
	text: 'Text',
	link: 'Link',
};
export type AttributeType = (typeof attributeTypeList)[number];

export const attributeInterfaceKeys = [
	'id',
	'pos',
	'name',
	'prefix',
	'suffix',
	'type',
	'range',
	'bestIndex',
	'selfRated',
	'importance',
];
export interface IAttribute {
	id: number;
	name: string;
	pos: number;
	hidden: boolean;
	prefix: string | null;
	suffix: string | null;
	type: AttributeType;
	range: [number, number] | [number, number, number];
	bestIndex: 0 | 1 | 2 | null;
	selfRated: boolean | null;
	importance: number | null;
}

export function isAttribute(value: any): value is IAttribute {
	return (value as IAttribute).type !== undefined;
}
