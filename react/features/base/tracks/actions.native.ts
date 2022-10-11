/* eslint-disable lines-around-comment */
import { IState, IStore } from '../../app/types';
// @ts-ignore
import { setPictureInPictureEnabled } from '../../mobile/picture-in-picture/functions';
// @ts-ignore
import { setAudioOnly } from '../audio-only';
import JitsiMeetJS from '../lib-jitsi-meet';

import { destroyLocalDesktopTrackIfExists, replaceLocalTrack } from './actions.any';
// @ts-ignore
import { getLocalVideoTrack, isLocalVideoTrackDesktop } from './functions';
/* eslint-enable lines-around-comment */

export * from './actions.any';

/**
 * Signals that the local participant is ending screensharing or beginning the screensharing flow.
 *
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @returns {Function}
 */
export function toggleScreensharing(enabled: boolean): Function {
    return (store: IStore) => _toggleScreenSharing(enabled, store);
}

/**
 * Toggles screen sharing.
 *
 * @private
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {Store} store - The redux.
 * @returns {void}
 */
function _toggleScreenSharing(enabled: boolean, store: IStore): void {
    const { dispatch, getState } = store;
    const state = getState();

    if (enabled) {
        const isSharing = isLocalVideoTrackDesktop(state);

        if (!isSharing) {
            _startScreenSharing(dispatch, state);
        }
    } else {
        dispatch(destroyLocalDesktopTrackIfExists());
        setPictureInPictureEnabled(true);
    }
}

/**
 * Creates desktop track and replaces the local one.
 *
 * @private
 * @param {Dispatch} dispatch - The redux {@code dispatch} function.
 * @param {Object} state - The redux state.
 * @returns {void}
 */
function _startScreenSharing(dispatch: Function, state: IState) {
    setPictureInPictureEnabled(false);

    JitsiMeetJS.createLocalTracks({ devices: [ 'desktop' ] })
    .then((tracks: any[]) => {
        const track = tracks[0];
        const currentLocalTrack = getLocalVideoTrack(state['features/base/tracks']);
        const currentJitsiTrack = currentLocalTrack?.jitsiTrack;

        dispatch(replaceLocalTrack(currentJitsiTrack, track));

        const { enabled: audioOnly } = state['features/base/audio-only'];

        if (audioOnly) {
            dispatch(setAudioOnly(false));
        }
    })
    .catch((error: any) => {
        console.log('ERROR creating ScreeSharing stream ', error);

        setPictureInPictureEnabled(true);
    });
}
