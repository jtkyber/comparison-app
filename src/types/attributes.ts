export type AttributeType = 'range2value' | 'range3value' | 'yesNo' | 'text' | 'link';
export type AttributeDataType = [number, number] | [number, number, number] | boolean | string;

export interface IAttribute {
	id: number;
	name: string;
	importance: number;
	type: AttributeType;
	data: AttributeDataType;
	prefix: string;
	suffix: string;
	rangeBest?: 0 | 1 | 2;
	selfRated?: boolean;
}
