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
	type: AttributeType;
	importance: number | null;
	range: [number, number, number];
	bestindex: 0 | 1 | 2 | null;
	selfRated: boolean;
	prefix: string | null;
	suffix: string | null;
}
