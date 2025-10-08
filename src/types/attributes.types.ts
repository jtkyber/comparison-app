export type AttributeType = 'range2value' | 'range3value' | 'yesNo' | 'text' | 'link';
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
