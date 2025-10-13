export type CellType = number | boolean | string;
export interface ICell {
	attributeID: number;
	value: CellType;
}

export interface IEntry {
	id: number;
	name: string;
	values: {
		[key: number]: CellType; // key = attributeID
	};
}
