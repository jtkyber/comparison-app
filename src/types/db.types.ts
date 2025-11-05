import { TextRating } from './attributes.types';

export type DBUser = {
	id: number;
	username: string;
	hash?: string;
};

export type DBComparison = {
	id: number;
	name: string;
	user_id: number;
};

export type DBAttribute = {
	id: number;
	comparison_id: number;
	pos: number;
	name: string;
	type: string;
	importance: number;
	range: number;
	best_index: number;
	prefix: string;
	suffix: string;
	text_rating_type: TextRating;
	hidden: boolean;
};

export type DBEntry = {
	id: number;
	comparison_id: number;
	pos: number;
	name: string;
	hidden: boolean;
};

export type DBCell = {
	id: number;
	entry_id: number;
	attribute_id: number;
	comparison_id: number;
	value: string;
	rating: number;
};

export type DBKeyRatingPair = {
	id: number;
	attribute_id: number;
	comparison_id: number;
	key: string;
	rating: number;
};

export type DBSettings = {
	id: number;
	auto_resize: boolean;
	user_id: number;
	selected_comparison: number;
};
