export type CellValueType = number | boolean | string | null;
export interface ICell {
	attributeID: number;
	value: CellValueType;
}

export interface ICellValue {
	value: CellValueType | null;
	rating: number | null;
}

export interface IEntry {
	id: number;
	name: string;
	cells: {
		[key: number]: ICellValue; // key = attributeID
	};
}
