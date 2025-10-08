import { IAttribute } from './attributes';
import { IEntry } from './entries';

export type TableManagerMode = 'attributes' | 'entries';

export type ActiveElement = IAttribute | IEntry | null;
