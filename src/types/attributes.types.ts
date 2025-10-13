export const attributeTypeList = ['number', 'yesNo', 'text', 'link'] as const;
export const attributeTypeListDisplayed = {
	number: 'Number',
	yesNo: 'Yes / No',
	text: 'Text',
	link: 'Link',
};
export type AttributeType = (typeof attributeTypeList)[number];

export interface IAttribute {
	id: number;
	name: string;
	prefix: string | null;
	suffix: string | null;
	type: AttributeType;
	range: [number, number] | [number, number, number];
	bestIndex: 0 | 1 | 2 | null;
	selfRated: boolean | null;
	importance: number | null;
}
