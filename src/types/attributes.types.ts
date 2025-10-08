export const attributeTypeList = ['range2value', 'range3value', 'yesNo', 'text', 'link'] as const;
export const attributeTypeListDisplayed = {
	range2value: 'Range (2 values)',
	range3value: 'Range (3 values)',
	yesNo: 'Yes or No',
	text: 'Text',
	link: 'Link',
};
export type AttributeType = (typeof attributeTypeList)[number];
export type AttributeDataType = [number, number] | [number, number, number] | boolean | string;

export interface IAttribute {
	id: number;
	name: string;
	importance: number | null;
	type: AttributeType;
	data: AttributeDataType;
	prefix: string | null;
	suffix: string | null;
	rangeBest: 0 | 1 | 2 | null;
	selfRated: boolean;
}
