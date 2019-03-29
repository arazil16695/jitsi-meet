/**
 * The type of Redux action which signals that the currently used audio
 * input device should be changed.
 *
 * {
 *     type: SET_AUDIO_INPUT_DEVICE,
 *     deviceId: string,
 * }
 */
export const SET_AUDIO_INPUT_DEVICE = 'SET_AUDIO_INPUT_DEVICE';

/**
 * The type of Redux action which signals that the currently used video
 * input device should be changed.
 *
 * {
 *     type: SET_VIDEO_INPUT_DEVICE,
 *     deviceId: string,
 * }
 */
export const SET_VIDEO_INPUT_DEVICE = 'SET_VIDEO_INPUT_DEVICE';

/**
 * The type of Redux action which signals that the list of known available
 * audio and video sources has changed.
 *
 * {
 *     type: UPDATE_DEVICE_LIST,
 *     devices: Array<MediaDeviceInfo>,
 * }
 */
export const UPDATE_DEVICE_LIST = 'UPDATE_DEVICE_LIST';

/**
 * The type of Redux action which will add a pending device requests that will
 * be executed later when it is possible (when the conference is joined).
 *
 * {
 *     type: ADD_PENDING_DEVICE_REQUEST,
 *     request: Object
 * }
 */
export const ADD_PENDING_DEVICE_REQUEST = 'ADD_PENDING_DEVICE_REQUEST';

/**
 * The type of Redux action which will remove all pending device requests.
 *
 * {
 *     type: REMOVE_PENDING_DEVICE_REQUESTS,
 *     request: Object
 * }
 */
export const REMOVE_PENDING_DEVICE_REQUESTS = 'REMOVE_PENDING_DEVICE_REQUESTS';
