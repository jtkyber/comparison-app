export type CellType = number | boolean | string;

export interface IEntry {
	id: number;
	name: string;
	values: {
		[key: number]: CellType; // key = attributeID
	};
}
