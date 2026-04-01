import { once } from 'lodash-es';
import { connect } from 'react-redux';
import { NativeModules } from 'react-native';
import { createToolbarEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { leaveConference } from '../../base/conference/actions';
import { translate } from '../../base/i18n/functions';
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import AbstractHangupButton from '../../base/toolbox/components/AbstractHangupButton';
const { LogBridge } = NativeModules;
/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @augments AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<AbstractButtonProps> {
    _hangup: Function;

    override accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    override label = 'toolbar.hangup';
    override tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: AbstractButtonProps) {
        super(props);

        this._hangup = once(() => {
            LogBridge.jitsiEvent('ReactNativeJs Hangup')
            sendAnalytics(createToolbarEvent('hangup'));
            this.props.dispatch(leaveConference());
            LogBridge.jitsiEvent('ReactNativeJs Hangup')
        });
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    override _doHangup() {
        this._hangup();
    }
}

export default translate(connect()(HangupButton));
