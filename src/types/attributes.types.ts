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
	'textRatingType',
	'selfRated',
	'importance',
	'keyRatingPairs',
];

export type TextRatingType = 'none' | 'selfrated' | 'keyratingpairs' | null;

export interface IKeyRatingPair {
	id: number;
	key: string;
	rating: number;
}

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
	textRatingType: TextRatingType;
	importance: number | null;
	keyRatingPairs: IKeyRatingPair[];
}

export function isAttribute(value: any): value is IAttribute {
	return (value as IAttribute).type !== undefined;
}
