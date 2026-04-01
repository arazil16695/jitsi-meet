import { IReduxState } from '../../app/types';
import { NativeModules } from 'react-native';
import { VIDEO_MUTE_BUTTON_ENABLED } from '../../base/flags/constants';
import { getFeatureFlag } from '../../base/flags/functions';
import { MEDIA_TYPE } from '../../base/media/constants';
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import BaseVideoMuteButton from '../../base/toolbox/components/BaseVideoMuteButton';
import { isLocalTrackMuted } from '../../base/tracks/functions';
import { handleToggleVideoMuted } from '../actions.any';
import { isVideoMuteButtonDisabled } from '../functions';
import {
    getRemoteParticipants,
    getParticipantDisplayName
} from '../../../base/participants/functions';
const { LogBridge } = NativeModules;
/**
 * The type of the React {@code Component} props of {@link AbstractVideoMuteButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether video button is disabled or not.
     */
    _videoDisabled: boolean;
    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean;
    participantNames: string[]; 
}
/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @augments BaseVideoMuteButton
 */
export default class AbstractVideoMuteButton<P extends IProps> extends BaseVideoMuteButton<P> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.videomute';
    override toggledAccessibilityLabel = 'toolbar.accessibilityLabel.videounmute';
    override label = 'toolbar.videomute';
    override toggledLabel = 'toolbar.videounmute';
    override tooltip = 'toolbar.videomute';
    override toggledTooltip = 'toolbar.videounmute';
    /**
     * Indicates if video is currently disabled or not.
     * @override
     * @protected
     * @returns {boolean}
     */
    override _isDisabled() {
        return this.props._videoDisabled;
    }
    /**
     * Indicates if video is currently muted or not.
     * @override
     * @protected
     * @returns {boolean}
     */
    override _isVideoMuted() {
        return this.props._videoMuted;
    }
    /**
     * Changes the muted state.
     * @override
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    override _setVideoMuted(videoMuted: boolean) {
        const { participantNames, dispatch } = this.props;

        // Process participant names when video is muted/unmuted
        const formattedNames = this.formatParticipantNames(participantNames);
        LogBridge.jitsiEvent('ReactNativeJS MuteVideo-/[' + formattedNames + ']----'+videoMuted+"");
        this.props.dispatch(handleToggleVideoMuted(videoMuted, true, true));
    }
    formatParticipantNames(names: string[]) {
        const extractedNames = names.map(n =>
            n?.includes('~') ? n.split('~')[1] : n
        );
        // Format the names as a comma-separated string
        return extractedNames.length ? extractedNames.join(',') : 'No participants found';
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoMuteButton} component.
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _videoMuted: boolean
 * }}
 */
export function mapStateToProps(state: IReduxState) {
    const tracks = state['features/base/tracks'];
    const enabledFlag = getFeatureFlag(state, VIDEO_MUTE_BUTTON_ENABLED, true);
    // Fetch the participants and map their names
    const base = state['features/base/participants'];
    const film = state['features/filmstrip'];
    const local = base.local ? [base.local] : [];
    const remoteIDs = Array.isArray(film.remoteParticipants) ? film.remoteParticipants : [];
    const remoteObjects = remoteIDs.map(id => base.remote?.get(id)).filter(Boolean);
    const participants = [...local, ...remoteObjects];
    const participantNames = participants.map((p: any) => 
        typeof p.name === 'string' && p.name.trim().length > 0 ? p.name : 'Unknown'
    );
    return {
        _videoDisabled: isVideoMuteButtonDisabled(state),
        _videoMuted: isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO),
        visible: enabledFlag,
        participantNames
    };
}