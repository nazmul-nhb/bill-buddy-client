import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { jwtDecode } from 'jwt-decode';
import type { CSSProperties } from 'react';
import { configs } from '../configs/site_configs';
import type { IDecodedUser } from '../types/user.types';

/**
 * Play a short sound effect.
 * - It is wise to put the sound file in `public` folder and use absolute path like `"/sounds/success.wav"`.
 * @param src Source of audio file as `string`.
 */
export const playSound = (src: string): void => {
	const audio = new Audio(src);
	audio.play();
};

/**
 * * Decode user from JWT token.
 * @param token JWT token to decode.
 * @returns Decoded user with role, email with JWT options.
 */
export const getDecodedUser = (token: string): IDecodedUser => {
	return jwtDecode(token) as IDecodedUser;
};

/**
 * * Get cloudinary image link from the filename.
 * @param src Image source, can be only the cloudinary public name for image like `"v1737848641/filename.jpg"`
 * @param baseUrl Base url for image link if it's not cloudinary image.
 * @returns Full image url.
 */
export const getImageLink = (src: string, baseUrl?: string): string => {
	if (baseUrl) return baseUrl.concat(src);
	return configs.image_base_url.concat(src);
};

/**
 * Generates unique filters from a given dataset.
 * @param data The dataset to extract unique filter values from.
 * @param key The key in the dataset to extract unique values.
 * @param valueExtractor Function to extract a valid key from the object.
 * @returns An array of filter objects for Ant Design Table.
 */
export const generateFilters = <T, K extends keyof T>(
	data: T[],
	key: K,
	valueExtractor?: (item: T[K]) => string | number
) => {
	const uniqueValues = Array.from(
		new Set(
			data
				?.map((item) =>
					valueExtractor
						? valueExtractor(item[key])
						: (item[key] as unknown as string | number)
				)
				?.filter((val) => val !== null && val !== undefined)
		)
	);

	return uniqueValues?.map((value) => ({
		text: typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value),
		value,
	}));
};

/**
 * * Prepare image for ant design upload preview.
 * @param src Image source, can be only the cloudinary public name for image like `"v1737848641/filename.jpg"`
 * @returns Prepared image for preview as an array of object.
 */
export const previewAntdImage = (src: string) => {
	return [
		{
			uid: '-1',
			name: 'Preview Image',
			status: 'done',
			url: getImageLink(src),
		},
	];
};

/** - Type Guard: Checks if error is a FetchBaseQueryError */
export const isFetchError = (error: unknown): error is FetchBaseQueryError => {
	return typeof error === 'object' && error !== null && 'data' in error;
};

/**
 * * Customize Antd Badge style
 * @param isGreen Whether the badge should be green or red.
 * @param top Top margin for the badge.
 * @returns Badge style object.
 */
export const getBadgeStyle = (isGreen = true, top = -2): CSSProperties => ({
	backgroundColor: 'rgba(0, 0, 0, 0)',
	fontSize: '0.9rem',
	fontWeight: 'bold',
	marginTop: top,
	color: isGreen ? 'green' : 'red',
	borderColor: 'rgba(0, 0, 0, 0)',
	paddingLeft: 2,
	paddingRight: 2,
});
