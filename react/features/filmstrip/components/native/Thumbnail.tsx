import React, { PureComponent } from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../../app/types';
import { JitsiTrackEvents } from '../../../base/lib-jitsi-meet';
import { MEDIA_TYPE, VIDEO_TYPE } from '../../../base/media/constants';
import { pinParticipant } from '../../../base/participants/actions';
import ParticipantView from '../../../base/participants/components/ParticipantView.native';
import { PARTICIPANT_ROLE } from '../../../base/participants/constants';
import {
  getLocalParticipant,
  getParticipantByIdOrUndefined,
  getParticipantCount,
  hasRaisedHand,
  isEveryoneModerator,
  isScreenShareParticipant
} from '../../../base/participants/functions';
import { FakeParticipant } from '../../../base/participants/types';
import Container from '../../../base/react/components/native/Container';
import { StyleType } from '../../../base/styles/functions.any';
import { trackStreamingStatusChanged } from '../../../base/tracks/actions.native';
import {
  getTrackByMediaTypeAndParticipant,
  getVideoTrackByParticipant
} from '../../../base/tracks/functions.native';
import { ITrack } from '../../../base/tracks/types';
import ConnectionIndicator from '../../../connection-indicator/components/native/ConnectionIndicator';
import DisplayNameLabel from '../../../display-name/components/native/DisplayNameLabel';
import { getGifDisplayMode, getGifForParticipant } from '../../../gifs/functions.native';
import {
  showConnectionStatus,
  showContextMenuDetails,
  showSharedVideoMenu
} from '../../../participants-pane/actions.native';
import { toggleToolboxVisible } from '../../../toolbox/actions.native';
import { shouldDisplayTileView } from '../../../video-layout/functions.native';

import AudioMutedIndicator from './AudioMutedIndicator';
import ModeratorIndicator from './ModeratorIndicator';
import PinnedIndicator from './PinnedIndicator';
import RaisedHandIndicator from './RaisedHandIndicator';
import ScreenShareIndicator from './ScreenShareIndicator';
import styles, { AVATAR_SIZE } from './styles';

interface IProps {
  _audioMuted: boolean;
  _fakeParticipant?: FakeParticipant;
  _gifSrc?: string;
  _isScreenShare: boolean;
  _isVirtualScreenshare: boolean;
  _local?: boolean;
  _localVideoOwner: boolean;
  _participantId: string;
  _pinned?: boolean;
  _raisedHand: boolean;
  _renderDominantSpeakerIndicator?: boolean;
  _renderModeratorIndicator: boolean;
  _shouldDisplayTileView: boolean;
  _videoTrack?: ITrack;
  dispatch: IStore['dispatch'];
  height?: number;
  width?: number;
  participantID?: string;
  renderDisplayName?: boolean;
  tileView?: boolean;
}

class Thumbnail extends PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
    this._onClick = this._onClick.bind(this);
    this._onThumbnailLongPress = this._onThumbnailLongPress.bind(this);
    this.handleTrackStreamingStatusChanged = this.handleTrackStreamingStatusChanged.bind(this);
  }

  _onClick() {
    const { _participantId, _pinned, dispatch, tileView } = this.props;
    if (tileView) {
      dispatch(toggleToolboxVisible());
    } else {
      dispatch(pinParticipant(_pinned ? null : _participantId));
    }
  }

  _onThumbnailLongPress() {
    const { _fakeParticipant, _participantId, _local, _localVideoOwner, dispatch } = this.props;
    if (_fakeParticipant && _localVideoOwner) {
      dispatch(showSharedVideoMenu(_participantId));
    } else if (!_fakeParticipant) {
      if (_local) {
        dispatch(showConnectionStatus(_participantId));
      } else {
        dispatch(showContextMenuDetails(_participantId));
      }
    }
  }

  _renderIndicators() {
    const {
      _audioMuted: audioMuted,
      _fakeParticipant,
      _isScreenShare: isScreenShare,
      _isVirtualScreenshare,
      _participantId: participantId,
      _pinned,
      _renderModeratorIndicator: renderModeratorIndicator,
      _shouldDisplayTileView,
      renderDisplayName,
      tileView
    } = this.props;

    const indicators = [];
    let bottomIndicatorsContainerStyle;

    if (_shouldDisplayTileView) {
      bottomIndicatorsContainerStyle = styles.bottomIndicatorsContainer;
    } else if (audioMuted || renderModeratorIndicator) {
      bottomIndicatorsContainerStyle = styles.bottomIndicatorsContainer;
    } else {
      bottomIndicatorsContainerStyle = null;
    }

    if (!_fakeParticipant || _isVirtualScreenshare) {
      indicators.push(
        <View key="top-left-indicators" style={styles.thumbnailTopLeftIndicatorContainer as ViewStyle}>
          {!_isVirtualScreenshare && <ConnectionIndicator participantId={participantId} />}
          {!_isVirtualScreenshare && <RaisedHandIndicator participantId={participantId} />}
          {tileView && (isScreenShare || _isVirtualScreenshare) && (
            <View style={styles.screenShareIndicatorContainer as ViewStyle}>
              <ScreenShareIndicator />
            </View>
          )}
        </View>
      );
      indicators.push(
        <Container key="bottom-indicators" style={styles.thumbnailIndicatorContainer as StyleType}>
          <Container style={bottomIndicatorsContainerStyle as StyleType}>
            {audioMuted && !_isVirtualScreenshare && <AudioMutedIndicator />}
            {!tileView && _pinned && <PinnedIndicator />}
            {renderModeratorIndicator && !_isVirtualScreenshare && <ModeratorIndicator />}
            {!tileView && (isScreenShare || _isVirtualScreenshare) && <ScreenShareIndicator />}
          </Container>
          {renderDisplayName && <DisplayNameLabel contained={true} participantId={participantId} />}
        </Container>
      );
    }

    return indicators;
  }

  override componentDidMount() {
    const { _videoTrack, dispatch } = this.props;
    if (_videoTrack && !_videoTrack.local) {
      _videoTrack.jitsiTrack.on(
        JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED,
        this.handleTrackStreamingStatusChanged
      );
      dispatch(
        trackStreamingStatusChanged(
          _videoTrack.jitsiTrack,
          _videoTrack.jitsiTrack.getTrackStreamingStatus()
        )
      );
    }
  }

  override componentDidUpdate(prevProps: IProps) {
    const { _videoTrack, dispatch } = this.props;
    if (prevProps._videoTrack?.jitsiTrack?.getSourceName() !== _videoTrack?.jitsiTrack?.getSourceName()) {
      if (prevProps._videoTrack && !prevProps._videoTrack.local) {
        prevProps._videoTrack.jitsiTrack.off(
          JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED,
          this.handleTrackStreamingStatusChanged
        );
        dispatch(
          trackStreamingStatusChanged(
            prevProps._videoTrack.jitsiTrack,
            prevProps._videoTrack.jitsiTrack.getTrackStreamingStatus()
          )
        );
      }
      if (_videoTrack && !_videoTrack.local) {
        _videoTrack.jitsiTrack.on(
          JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED,
          this.handleTrackStreamingStatusChanged
        );
        dispatch(
          trackStreamingStatusChanged(
            _videoTrack.jitsiTrack,
            _videoTrack.jitsiTrack.getTrackStreamingStatus()
          )
        );
      }
    }
  }

  override componentWillUnmount() {
    const { _videoTrack, dispatch } = this.props;
    if (_videoTrack && !_videoTrack.local) {
      _videoTrack.jitsiTrack.off(
        JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED,
        this.handleTrackStreamingStatusChanged
      );
      dispatch(
        trackStreamingStatusChanged(
          _videoTrack.jitsiTrack,
          _videoTrack.jitsiTrack.getTrackStreamingStatus()
        )
      );
    }
  }

  handleTrackStreamingStatusChanged(jitsiTrack: any, streamingStatus: string) {
    this.props.dispatch(trackStreamingStatusChanged(jitsiTrack, streamingStatus));
  }

  override render() {
    const {
      _fakeParticipant,
      _gifSrc,
      _isScreenShare: isScreenShare,
      _isVirtualScreenshare,
      _participantId: participantId,
      _raisedHand,
      _renderDominantSpeakerIndicator,
      height,
      width,
      tileView
    } = this.props;

    const styleOverrides = tileView
      ? {
          flex: 0,
          width,
          height,
          maxHeight: undefined,
          maxWidth: undefined
        }
      : null;

    return (
      <Container
        onClick={this._onClick}
        onLongPress={this._onThumbnailLongPress}
        style={[
          styles.thumbnail,
          styleOverrides,
          _raisedHand && !_isVirtualScreenshare ? styles.thumbnailRaisedHand : null,
          _renderDominantSpeakerIndicator && !_isVirtualScreenshare ? styles.thumbnailDominantSpeaker : null
        ] as StyleType[]}
        touchFeedback={false}
      >
        {_gifSrc ? (
          <Image source={{ uri: _gifSrc }} style={styles.thumbnailGif as ImageStyle} />
        ) : (
          <>
            <ParticipantView
              style={{ width: '100%', height: '100%' }}
              avatarSize={tileView ? AVATAR_SIZE * 1.5 : AVATAR_SIZE}
              disableVideo={!tileView && (isScreenShare || _fakeParticipant)}
              participantId={participantId || this.props.participantID}
              zOrder={1}
            />
            {this._renderIndicators()}
          </>
        )}
      </Container>
    );
  }
}

function _mapStateToProps(state: IReduxState, ownProps: any) {
  const { ownerId } = state['features/shared-video'];
  const tracks = state['features/base/tracks'];
  const { participantID, tileView } = ownProps;
  const participant = getParticipantByIdOrUndefined(state, participantID);
  const localParticipantId = getLocalParticipant(state)?.id;
  const id = participant?.id || participantID; // fallback if lookup misses
  const audioTrack = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);
  const videoTrack = getVideoTrackByParticipant(state, participant);
  const isScreenShare = videoTrack?.videoType === VIDEO_TYPE.DESKTOP;
  const participantCount = getParticipantCount(state);
  const renderDominantSpeakerIndicator = participant?.dominantSpeaker && participantCount > 2;
  const _isEveryoneModerator = isEveryoneModerator(state);
  const renderModeratorIndicator =
    tileView && !_isEveryoneModerator && participant?.role === PARTICIPANT_ROLE.MODERATOR;
  const { gifUrl: gifSrc } = getGifForParticipant(state, id ?? '');
  const mode = getGifDisplayMode(state);

  return {
    _audioMuted: audioTrack?.muted ?? true,
    _fakeParticipant: participant?.fakeParticipant,
    _gifSrc: mode === 'chat' ? undefined : gifSrc,
    _isScreenShare: isScreenShare,
    _isVirtualScreenshare: isScreenShareParticipant(participant),
    _local: participant?.local,
    _localVideoOwner: Boolean(ownerId === localParticipantId),
    _participantId: id ?? '',
    _pinned: participant?.pinned,
    _raisedHand: hasRaisedHand(participant),
    _renderDominantSpeakerIndicator: renderDominantSpeakerIndicator,
    _renderModeratorIndicator: renderModeratorIndicator,
    _shouldDisplayTileView: shouldDisplayTileView(state),
    _videoTrack: videoTrack
  };
}

export default connect(_mapStateToProps)(Thumbnail);
