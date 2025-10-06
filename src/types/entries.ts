export type CellType = number | boolean | string;

export interface IEntry {
	name: string;
	values: {
		[key: number]: CellType; // key = attributeID
	};
}
