export const attributeTypeList = ['range2value', 'range3value', 'yesNo', 'text', 'link'] as const;
export const attributeTypeListDisplayed = {
	range2value: 'Range (2 values)',
	range3value: 'Range (3 values)',
	yesNo: 'Yes or No',
	text: 'Text',
	link: 'Link',
};
export type AttributeType = (typeof attributeTypeList)[number];

export interface IAttribute {
	id: number;
	name: string;
	type: AttributeType;
	importance: number | null;
	range: [number, number] | [number, number, number];
	bestindex: 0 | 1 | 2 | null;
	selfRated: boolean;
	prefix: string | null;
	suffix: string | null;
}
