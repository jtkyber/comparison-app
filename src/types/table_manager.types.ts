import { IAttribute } from './attributes.types';
import { IEntry } from './entries.types';

export type TableManagerMode = 'attributes' | 'entries';

export type ActiveElement = IAttribute | IEntry | null;
