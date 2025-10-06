import { IAttributeType } from './attributes';

export interface ICell {
	value: IAttributeType;
	rating?: number;
}

export interface IEntry {
	name: string;
	cells: [key: ICell]; // key = attributeID
}
