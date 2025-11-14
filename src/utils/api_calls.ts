import { IAttribute } from '../types/attributes.types';
import { IComparison, IComparisonItem } from '../types/comparisons.types';
import { IEntry } from '../types/entries.types';
import { ISettings } from '../types/settings.types';
import { IUser } from '../types/user.types';

type Id = string | number;

export const endpoints = {
	user: {
		async get(
			username: string,
			password: string
		): Promise<{
			user: IUser;
			settings: ISettings;
		}> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username,
						password,
					}),
				});

				const data = await res.json();

				return data;
			} catch (err) {
				throw new Error('Could not retrieve user');
			}
		},

		async getWithID(id: number): Promise<{
			user: IUser;
			settings: ISettings;
		}> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error('Could not retrieve user');
			}
		},
		async register(
			username: string,
			password: string
		): Promise<{
			user: IUser;
			settings: ISettings;
		}> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username,
						password,
					}),
				});

				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error('Could not retrieve user');
			}
		},
	},
	comparisons: {
		async getTable(id: Id, userID?: Id): Promise<IComparison> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/table`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: id,
						userID: userID,
					}),
				});

				const data = await res.json();

				return data;
			} catch (err) {
				throw new Error('Could not retrieve comparison table');
			}
		},
		async getName(id: Id): Promise<string> {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/getComparisonName/${id}`
				);
				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async add(
			userID: Id,
			name: string
		): Promise<{
			comparisons: IComparisonItem[];
			newComparisonID: number;
		}> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/addComparison`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userID: userID,
						name: name,
					}),
				});
				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async delete(id: Id): Promise<IComparisonItem> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/comparisons/removeComparison`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id,
					}),
				});
				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
	},
	attributes: {
		async add(comparisonID: Id, attribute: IAttribute): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/addAttribute`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						attribute: attribute,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async update(comparisonID: Id, attribute: IAttribute): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/updateAttribute`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						attribute: attribute,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async delete(comparisonID: Id, ids: Id[]): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/removeAttributes`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						attributeIDs: ids,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async move(comparisonID: Id, id: Id, indexOfMoved: number): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/moveAttribute`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						attributeID: id,
						newAttrPos: indexOfMoved,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async toggleHidden(id: Id): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/attributes/toggleAttributeHidden`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: id,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
	},
	entries: {
		async add(comparisonID: Id, entry: IEntry): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/addEntry`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						entry: entry,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async update(comparisonID: Id, entry: IEntry): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/updateEntry`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						entry: entry,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async delete(comparisonID: Id, ids: Id[]): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/removeEntries`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						entryIDs: ids,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async move(comparisonID: Id, id: Id, indexOfMoved: number): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/moveEntry`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						comparisonID: comparisonID,
						entryID: id,
						newEntryPos: indexOfMoved,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
		async toggleHidden(id: Id): Promise<void> {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/entries/toggleEntryHidden`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: id,
					}),
				});
				await res.json();
			} catch (err) {
				throw new Error('Could not retrieve comparison name');
			}
		},
	},
	settings: {
		fitColMin: {
			async set(userID: Id, fitColMin: boolean): Promise<void> {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setAutoResize`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userID: userID,
							fitColMin: fitColMin,
						}),
					});
					await res.json();
				} catch (err) {
					throw new Error('Could not set selected comparison');
				}
			},
		},
		selectedComparison: {
			async set(userID: Id, comparisonID: Id): Promise<void> {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setSelectedComparison`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userID: userID,
							comparisonID: comparisonID,
						}),
					});
					await res.json();
				} catch (err) {
					throw new Error('Could not set selected comparison');
				}
			},
		},
		colorCellsByRating: {
			async set(userID: Id, colorCellsByRating: boolean): Promise<void> {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setColorCellsByRating`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userID: userID,
							colorCellsByRating: colorCellsByRating,
						}),
					});
					await res.json();
				} catch (err) {
					throw new Error('Could not set table zoom');
				}
			},
		},
		tableZoom: {
			async set(userID: Id, tableZoom: number): Promise<void> {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setTableZoom`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userID: userID,
							tableZoom: tableZoom,
						}),
					});
					await res.json();
				} catch (err) {
					throw new Error('Could not set table zoom');
				}
			},
		},
		managerWidth: {
			async set(userID: Id, width: number): Promise<void> {
				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/setManagerWidth`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userID: userID,
							width: width,
						}),
					});
					await res.json();
				} catch (err) {
					throw new Error('Could not set manager width');
				}
			},
		},
	},
};
