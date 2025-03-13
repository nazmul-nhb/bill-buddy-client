type SoundEffect =
	| 'success'
	| 'error'
	| 'info'
	| 'warning'
	// | 'loading'
	| 'confirm'
	| 'open';

/**
 * * Get the corresponding sound file path for a given sound effect.
 *
 * @param effect - The name of the sound effect.
 * @returns The file path of the sound effect.
 */
export const getSoundFile = (effect: SoundEffect): string => {
	const basePath = '/sounds/';

	switch (effect) {
		case 'success':
			return basePath.concat('success.mp3');
		case 'error':
			return basePath.concat('error.mp3');
		case 'open':
		case 'info':
			return basePath.concat('info.mp3');
		case 'warning':
			return basePath.concat('warning.mp3');
		// case 'loading':
		// 	return basePath.concat('loading.mp3');
		case 'confirm':
			return basePath.concat('confirm.mp3');
		default:
			return basePath.concat('info.mp3');
	}
};
