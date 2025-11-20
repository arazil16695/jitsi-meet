import React from 'react';
import { View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from '../../../app/types';
import { getConferenceName, getConferenceTimestamp } from '../../../base/conference/functions';
import {
  AUDIO_DEVICE_BUTTON_ENABLED,
  CONFERENCE_TIMER_ENABLED,
  TOGGLE_CAMERA_BUTTON_ENABLED,
} from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import AudioDeviceToggleButton from '../../../mobile/audio-mode/components/AudioDeviceToggleButton';
import PictureInPictureButton from '../../../mobile/picture-in-picture/components/PictureInPictureButton';
import ParticipantsPaneButton from '../../../participants-pane/components/native/ParticipantsPaneButton';
import { isParticipantsPaneEnabled } from '../../../participants-pane/functions';
import { isRoomNameEnabled } from '../../../prejoin/functions.native';
import ToggleCameraButton from '../../../toolbox/components/native/ToggleCameraButton';
import { isToolboxVisible } from '../../../toolbox/functions.native';
import styles from './styles';
/**
* The type of the React {@code Component} props of {@link TitleBar}.
*/
interface IProps {
  _audioDeviceButtonEnabled: boolean;
  _conferenceTimerEnabled: boolean;
  _createOnPress: Function;
  _isParticipantsPaneEnabled: boolean;
  _meetingName: string;
  _roomNameEnabled: boolean;
  _toggleCameraButtonEnabled: boolean;
  _visible: boolean;
}
const TitleBar = (props: IProps) => {
  const { _isParticipantsPaneEnabled, _visible } = props;
  if (!_visible) {
    return null;
  }
  return (
    <View style={styles.titleBarWrapper as ViewStyle}>
      {/* PIP button placed on the left */}
      <View style={styles.pipButtonContainer}>
        <PictureInPictureButton styles={styles.pipButton} />
      </View>
      {/* Right-aligned buttons */}
      <View style={styles.rightButtonsContainer}>
        {props._toggleCameraButtonEnabled && (
          <View style={styles.titleBarButtonContainer}>
            <ToggleCameraButton styles={styles.titleBarButton} />
          </View>
        )}
        {props._audioDeviceButtonEnabled && (
          <View style={styles.titleBarButtonContainer}>
            <AudioDeviceToggleButton styles={styles.titleBarButton} />
          </View>
        )}
        {_isParticipantsPaneEnabled && (
          <View style={styles.titleBarButtonContainer}>
            <ParticipantsPaneButton styles={styles.titleBarButton} />
          </View>
        )}
      </View>
    </View>
  );
};
// Maps part of the Redux store to the props of this component.
function _mapStateToProps(state: IReduxState) {
  const { hideConferenceTimer } = state['features/base/config'];
  const startTimestamp = getConferenceTimestamp(state);
  return {
    _audioDeviceButtonEnabled: getFeatureFlag(state, AUDIO_DEVICE_BUTTON_ENABLED, true),
    _conferenceTimerEnabled: Boolean(
      getFeatureFlag(state, CONFERENCE_TIMER_ENABLED, true) && !hideConferenceTimer && startTimestamp
    ),
    _isParticipantsPaneEnabled: isParticipantsPaneEnabled(state),
    _meetingName: getConferenceName(state),
    _roomNameEnabled: isRoomNameEnabled(state),
    _toggleCameraButtonEnabled: getFeatureFlag(state, TOGGLE_CAMERA_BUTTON_ENABLED, true),
    _visible: isToolboxVisible(state),
  };
}
export default connect(_mapStateToProps)(TitleBar);