import JitsiMeetJS from '../lib-jitsi-meet';
import { updateSettings } from '../settings';

import {
    ADD_PENDING_DEVICE_REQUEST,
    REMOVE_PENDING_DEVICE_REQUESTS,
    SET_AUDIO_INPUT_DEVICE,
    SET_VIDEO_INPUT_DEVICE,
    UPDATE_DEVICE_LIST
} from './actionTypes';
import {
    areDeviceLabelsInitialized,
    getDeviceIdByLabel,
    getDevicesFromURL
} from './functions';

/**
 * Adds a pending device request.
 *
 * @param {Object} request - The request to be added.
 * @returns {{
 *      type: ADD_PENDING_DEVICE_REQUEST,
 *      request: Object
 * }}
 */
export function addPendingDeviceRequest(request) {
    return {
        type: ADD_PENDING_DEVICE_REQUEST,
        request
    };
}

/**
 * Configures the initial A/V devices before the conference has started.
 *
 * @returns {Function}
 */
export function configureInitialDevices() {
    return (dispatch, getState) => new Promise(resolve => {
        const deviceLabels = getDevicesFromURL(getState());

        if (deviceLabels) {
            dispatch(getAvailableDevices()).then(() => {
                const state = getState();

                if (!areDeviceLabelsInitialized(state)) {
                    // The labels are not available if the A/V permissions are
                    // not yet granted.

                    Object.keys(deviceLabels).forEach(key => {
                        dispatch(addPendingDeviceRequest({
                            type: 'devices',
                            name: 'setDevice',
                            device: {
                                kind: key.toLowerCase(),
                                label: deviceLabels[key]
                            },
                            // eslint-disable-next-line no-empty-function
                            responseCallback() {}
                        }));
                    });
                    resolve();

                    return;
                }
                const newSettings = {};
                const devicesKeysToSettingsKeys = {
                    audioInput: 'micDeviceId',
                    audioOutput: 'audioOutputDeviceId',
                    videoInput: 'cameraDeviceId'
                };

                Object.keys(deviceLabels).forEach(key => {
                    const label = deviceLabels[key];
                    const deviceId = getDeviceIdByLabel(state, label);

                    if (deviceId) {
                        newSettings[devicesKeysToSettingsKeys[key]] = deviceId;
                    }
                });

                dispatch(updateSettings(newSettings));
                resolve();
            });

        } else {
            resolve();
        }
    });
}

/**
 * Queries for connected A/V input and output devices and updates the redux
 * state of known devices.
 *
 * @returns {Function}
 */
export function getAvailableDevices() {
    return dispatch => new Promise(resolve => {
        const { mediaDevices } = JitsiMeetJS;

        if (mediaDevices.isDeviceListAvailable()
                && mediaDevices.isDeviceChangeAvailable()) {
            mediaDevices.enumerateDevices(devices => {
                dispatch(updateDeviceList(devices));

                resolve(devices);
            });
        } else {
            resolve([]);
        }
    });
}


/**
 * Remove all pending device requests.
 *
 * @returns {{
 *      type: REMOVE_PENDING_DEVICE_REQUESTS
 * }}
 */
export function removePendingDeviceRequests() {
    return {
        type: REMOVE_PENDING_DEVICE_REQUESTS
    };
}

/**
 * Signals to update the currently used audio input device.
 *
 * @param {string} deviceId - The id of the new audio input device.
 * @returns {{
 *      type: SET_AUDIO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
export function setAudioInputDevice(deviceId) {
    return {
        type: SET_AUDIO_INPUT_DEVICE,
        deviceId
    };
}

/**
 * Signals to update the currently used video input device.
 *
 * @param {string} deviceId - The id of the new video input device.
 * @returns {{
 *      type: SET_VIDEO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
export function setVideoInputDevice(deviceId) {
    return {
        type: SET_VIDEO_INPUT_DEVICE,
        deviceId
    };
}

/**
 * Signals to update the list of known audio and video devices.
 *
 * @param {Array<MediaDeviceInfo>} devices - All known available audio input,
 * audio output, and video input devices.
 * @returns {{
 *      type: UPDATE_DEVICE_LIST,
 *      devices: Array<MediaDeviceInfo>
 * }}
 */
export function updateDeviceList(devices) {
    return {
        type: UPDATE_DEVICE_LIST,
        devices
    };
}

