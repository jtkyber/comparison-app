export interface IAttributeValidation {
	name: string | null;
	prefix: string | null;
	suffix: string | null;
	rangeValues: string | null;
	pairName: string | null;
}

export type AttributeValidationKey = keyof IAttributeValidation;

export const attributeValidationDefault: IAttributeValidation = {
	name: null,
	prefix: null,
	suffix: null,
	rangeValues: null,
	pairName: null,
};
