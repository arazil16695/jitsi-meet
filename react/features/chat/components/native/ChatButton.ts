import { connect } from 'react-redux';
import { NativeModules } from 'react-native';
import { IReduxState } from '../../../app/types';
import { CHAT_ENABLED } from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import { translate } from '../../../base/i18n/functions';
import { IconChatUnread, IconMessage } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { arePollsDisabled } from '../../../conference/functions.any';
import { getUnreadPollCount } from '../../../polls/functions';
import { getUnreadCount } from '../../functions';
import {
    getRemoteParticipants,
    getParticipantDisplayName
} from '../../../base/participants/functions';
const { LogBridge } = NativeModules;
interface IProps extends AbstractButtonProps {
    _isPollsDisabled?: boolean;
    _unreadMessageCount: number;
    participantNames: string[];
}
class ChatButton extends AbstractButton<IProps> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.chat';
    override icon = IconMessage;
    override label = 'toolbar.chat';
    override toggledIcon = IconChatUnread;
    override _handleClick() {
        const names = this.props.participantNames;
        const formatted = names.length
        ? names.join(',')
        : 'No participants found';
        LogBridge.jitsiEvent('ReactNativeJS Chat-/['+formatted+']');
    }
    override _isToggled() {
        return Boolean(this.props._unreadMessageCount);
    }
}
function _mapStateToProps(state: IReduxState, ownProps: any) {
    const enabled = getFeatureFlag(state, CHAT_ENABLED, true);
    const { visible = enabled } = ownProps;
    const base = state['features/base/participants'];
    const film = state['features/filmstrip'];
    const local = base.local ? [base.local] : [];
    const remoteIDs = Array.isArray(film.remoteParticipants)
        ? film.remoteParticipants
        : [];
    const remoteObjects = remoteIDs
        .map(id => base.remote?.get(id))
        .filter(Boolean);
    const participants = [...local, ...remoteObjects];
    const participantNames = participants.map((p: any) =>
        typeof p.name === 'string' && p.name.trim().length > 0
            ? p.name
            : 'Unknown'
    );
    return {
        _isPollsDisabled: arePollsDisabled(state),
        _unreadMessageCount: getUnreadCount(state) || getUnreadPollCount(state),
        visible,
        participantNames
    };
}
export default translate(connect(_mapStateToProps)(ChatButton));