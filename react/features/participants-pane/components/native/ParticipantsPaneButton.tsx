import React, { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from '../../../app/types';
import { IconUsers } from '../../../base/icons/svg';
import { getParticipantCountForDisplay } from '../../../base/participants/functions';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { withTranslation } from 'react-i18next';
import { navigate }
    from '../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
 
const { LogBridge } = NativeModules;
 
interface IProps extends AbstractButtonProps {
  _participantsCount: number;
  t: any;
  i18n: any;
  tReady: boolean;
}
 
class ParticipantsPaneButton extends AbstractButton<IProps> {
  override icon = IconUsers;
  override label = 'toolbar.participants';
 
  state = {
    isInitialized: false,
  };
 
 
  override _handleClick() {
    // Only emit event if JitsiMeetJS is initialized
      // Emit the custom event `onRequestAddParticipant`
    // Check if LogBridge and logWarning exist
      // Call the logWarning method from the native module
      return navigate(screen.conference.participants);
      //      LogBridge.jitsiEvent('ReactNativeJS Open AddMember');
  }
 
  _getAccessibilityLabel() {
    const { t, _participantsCount } = this.props;
    return t('toolbar.accessibilityLabel.participants', {
      participantsCount: _participantsCount,
    });
  }
}
 
function mapStateToProps(state: IReduxState) {
  return {
    _participantsCount: getParticipantCountForDisplay(state),
  };
}
 
export default withTranslation()(connect(mapStateToProps)(ParticipantsPaneButton));
 
 