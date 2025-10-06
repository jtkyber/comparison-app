export interface IAttributeType {
	range2value: [number, number];
	range3value: [number, number, number];
	yesNo: boolean;
	text: string;
	link: string;
}

export interface IAttribute {
	name: string;
	importance: number;
	type: IAttributeType;
	units: string;
	rangeBest?: 0 | 1 | 2;
	selfRated?: boolean;
}
