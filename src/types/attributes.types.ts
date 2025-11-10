export const attributeTypeList = ['text', 'number', 'score', 'yesNo', 'link'] as const;
export const attributeTypeListDisplayed = {
	text: 'Text',
	number: 'Number',
	score: 'Score',
	yesNo: 'Yes / No',
	link: 'Link',
};
export type AttributeType = (typeof attributeTypeList)[number];

export type TextRating = 'none' | 'selfrated' | 'keyratingpairs' | null;

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
	textRatingType: TextRating;
	importance: number | null;
	keyRatingPairs: IKeyRatingPair[];
}

export function isAttribute(value: any): value is IAttribute {
	return (value as IAttribute).type !== undefined;
}
