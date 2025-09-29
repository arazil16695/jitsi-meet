import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
    BackHandler,
    NativeModules,
    Platform,
    SafeAreaView,
    StatusBar,
    View,
    ViewStyle
} from 'react-native';
import { EdgeInsets, withSafeAreaInsets } from 'react-native-safe-area-context';
import { connect, useDispatch } from 'react-redux';
 
import { appNavigate } from '../../../app/actions.native';
import { IReduxState, IStore } from '../../../app/types';
import { CONFERENCE_BLURRED, CONFERENCE_FOCUSED } from '../../../base/conference/actionTypes';
import { isDisplayNameVisible } from '../../../base/config/functions.native';
import { FULLSCREEN_ENABLED } from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import Container from '../../../base/react/components/native/Container';
import LoadingIndicator from '../../../base/react/components/native/LoadingIndicator';
import TintedView from '../../../base/react/components/native/TintedView';
import {
    ASPECT_RATIO_NARROW,
    ASPECT_RATIO_WIDE
} from '../../../base/responsive-ui/constants';
import { StyleType } from '../../../base/styles/functions.any';
import TestConnectionInfo from '../../../base/testing/components/TestConnectionInfo';
import { isCalendarEnabled } from '../../../calendar-sync/functions.native';
import DisplayNameLabel from '../../../display-name/components/native/DisplayNameLabel';
import BrandingImageBackground from '../../../dynamic-branding/components/native/BrandingImageBackground';
import Filmstrip from '../../../filmstrip/components/native/Filmstrip';
import TileView from '../../../filmstrip/components/native/TileView';
import { FILMSTRIP_SIZE } from '../../../filmstrip/constants';
import { isFilmstripVisible } from '../../../filmstrip/functions.native';
import CalleeInfoContainer from '../../../invite/components/callee-info/CalleeInfoContainer';
import LargeVideo from '../../../large-video/components/LargeVideo.native';
import { getIsLobbyVisible } from '../../../lobby/functions';
import { navigate } from '../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
import { isPipEnabled, setPictureInPictureEnabled } from '../../../mobile/picture-in-picture/functions';
import Captions from '../../../subtitles/components/native/Captions';
import { setToolboxVisible } from '../../../toolbox/actions.native';
import Toolbox from '../../../toolbox/components/native/Toolbox';
import { isToolboxVisible } from '../../../toolbox/functions.native';
import {
    AbstractConference,
    type AbstractProps,
    abstractMapStateToProps
} from '../AbstractConference';
import { isConnecting } from '../functions.native';
 
import AlwaysOnLabels from './AlwaysOnLabels';
import ExpandedLabelPopup from './ExpandedLabelPopup';
import LonelyMeetingExperience from './LonelyMeetingExperience';
import TitleBar from './TitleBar';
import { EXPANDED_LABEL_TIMEOUT } from './constants';
import styles from './styles';
 
/**
* The type of the React {@code Component} props of {@link Conference}.
*/
interface IProps extends AbstractProps {
    _aspectRatio: Symbol;
    _audioOnlyEnabled: boolean;
    _brandingStyles: StyleType;
    _calendarEnabled: boolean;
    _connecting: boolean;
    _filmstripVisible: boolean;
    _fullscreenEnabled: boolean;
    _isDisplayNameVisible: boolean;
    _isParticipantsPaneOpen: boolean;
    _largeVideoParticipantId: string;
    _localParticipantDisplayName: string;
    _pictureInPictureEnabled: boolean;
    _reducedUI: boolean;
    _showLobby: boolean;
    _startCarMode: boolean;
    _toolboxVisible: boolean;
    dispatch: IStore['dispatch'];
    insets: EdgeInsets;
    navigation: any;
}
 
type State = {
    visibleExpandedLabel?: string;
};
 
class Conference extends AbstractConference<IProps, State> {
    _expandedLabelTimeout: any;
    _hardwareBackPressSubscription: any;
    _autoHideTimer: any;
 
    constructor(props: IProps) {
        super(props);
 
        this.state = {
            visibleExpandedLabel: undefined
        };
 
        this._expandedLabelTimeout = React.createRef<number>();
        this._autoHideTimer = null;
 
        this._onClick = this._onClick.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._setToolboxVisible = this._setToolboxVisible.bind(this);
        this._createOnPress = this._createOnPress.bind(this);
    }
 
    override componentDidMount() {
        const {
            _audioOnlyEnabled,
            _startCarMode,
            navigation
        } = this.props;
 
        this._hardwareBackPressSubscription = BackHandler.addEventListener('hardwareBackPress', this._onHardwareBackPress);
 
        if (_audioOnlyEnabled && _startCarMode) {
            navigation.navigate(screen.conference.carmode);
        }
    }
 
    override componentDidUpdate(prevProps: IProps) {
        if (!prevProps._toolboxVisible && this.props._toolboxVisible) {
            this._startAutoHideTimer();
        }
    }
 
    override componentWillUnmount() {
        this._hardwareBackPressSubscription?.remove();
        clearTimeout(this._expandedLabelTimeout.current ?? 0);
        clearTimeout(this._autoHideTimer);
    }
 
 

    override render() {
        const { _brandingStyles, _fullscreenEnabled } = this.props;
 
        return (
            <Container
                style={[
                    styles.conference,
                    _brandingStyles
                ]}>
                <BrandingImageBackground />
                {
                    Platform.OS === 'android'
                    && <StatusBar
                        barStyle='light-content'
                        hidden={_fullscreenEnabled}
                        translucent={_fullscreenEnabled} />
                }
                { this._renderContent() }
            </Container>
        );
    }
 
    _onClick() {
        const { _toolboxVisible } = this.props;
        console.log('Toggling toolbox visibility: ', !_toolboxVisible); // Debugging log
        this._setToolboxVisible(!_toolboxVisible);
 
        if (!_toolboxVisible) {
            this._startAutoHideTimer();
        } else {
            clearTimeout(this._autoHideTimer);
        }
    }
 
    _startAutoHideTimer() {
        clearTimeout(this._autoHideTimer);
        console.log('Starting auto-hide timer...'); // Debugging log
        this._autoHideTimer = setTimeout(() => {
            console.log('Auto-hiding toolbox after 3 seconds');
            this._setToolboxVisible(false);
        }, 3000); // auto-hide after 3 seconds
    }
 
    _onHardwareBackPress() {
        let p;
 
        if (this.props._pictureInPictureEnabled) {
            const { PictureInPicture } = NativeModules;
            p = PictureInPicture.enterPictureInPicture();
        } else {
            p = Promise.reject(new Error('PiP not enabled'));
        }
 
        p.catch(() => {
            this.props.dispatch(appNavigate(undefined));
        });
 
        return true;
    }
 
    _createOnPress(label: string) {
        return () => {
            const { visibleExpandedLabel } = this.state;
            const newVisibleExpandedLabel
                = visibleExpandedLabel === label ? undefined : label;
 
            clearTimeout(this._expandedLabelTimeout.current);
            this.setState({ visibleExpandedLabel: newVisibleExpandedLabel });
 
            if (newVisibleExpandedLabel) {
                this._expandedLabelTimeout.current = setTimeout(() => {
                    this.setState({ visibleExpandedLabel: undefined });
                }, EXPANDED_LABEL_TIMEOUT);
            }
        };
    }
 
    _renderContent() {
        const {
            _aspectRatio,
            _connecting,
            _filmstripVisible,
            _isDisplayNameVisible,
            _largeVideoParticipantId,
            _reducedUI,
            _shouldDisplayTileView,
            _toolboxVisible
        } = this.props;
 
        let alwaysOnTitleBarStyles;
 
        if (_reducedUI) {
            return this._renderContentForReducedUi();
        }
 
        if (_aspectRatio === ASPECT_RATIO_WIDE) {
            alwaysOnTitleBarStyles
                = !_shouldDisplayTileView && _filmstripVisible
                    ? styles.alwaysOnTitleBarWide
                    : styles.alwaysOnTitleBar;
        } else {
            alwaysOnTitleBarStyles = styles.alwaysOnTitleBar;
        }
 
        return (
    <>
        {
            _shouldDisplayTileView
                ? <TileView onClick={this._onClick} />
                : <LargeVideo onClick={this._onClick} />
        }

        <CalleeInfoContainer />

        { _connecting &&
            <TintedView>
                <LoadingIndicator />
            </TintedView>
        }

        {/* Toolbox + Filmstrip container pinned at bottom */}
        <View
            pointerEvents="box-none"
            style={styles.toolboxAndFilmstripContainer as ViewStyle}>

            <Captions onPress={this._onClick} />

            {/* {
                _shouldDisplayTileView
                || (_isDisplayNameVisible && (
                    <Container style={styles.displayNameContainer}>
                        <DisplayNameLabel participantId={_largeVideoParticipantId} />
                    </Container>
                ))
            }  */}

            { !_shouldDisplayTileView && <LonelyMeetingExperience /> }

            {
                _shouldDisplayTileView
                || <>
                <View style={{ marginBottom: 100 }}>
                    <Filmstrip />
                </View>
                    { this._renderNotificationsContainer() }
                    { _toolboxVisible && <Toolbox /> }
                </>
            }
        </View>

        <SafeAreaView
            pointerEvents="box-none"
            style={
                (_toolboxVisible
                    ? styles.titleBarSafeViewColor
                    : styles.titleBarSafeViewTransparent) as ViewStyle
            }>
            <TitleBar _createOnPress={this._createOnPress} />
        </SafeAreaView>

        <SafeAreaView
            pointerEvents="box-none"
            style={
                (_toolboxVisible
                    ? [styles.titleBarSafeViewTransparent, { top: this.props.insets.top + 50 }]
                    : styles.titleBarSafeViewTransparent) as ViewStyle
            }>
            <View pointerEvents="box-none" style={styles.expandedLabelWrapper}>
                <ExpandedLabelPopup visibleExpandedLabel={this.state.visibleExpandedLabel} />
            </View>
            <View pointerEvents="box-none" style={alwaysOnTitleBarStyles as ViewStyle}>
                <AlwaysOnLabels createOnPress={this._createOnPress} />
            </View>
        </SafeAreaView>

        <TestConnectionInfo />

        {
            _shouldDisplayTileView
            && <>
                { this._renderNotificationsContainer() }
                { _toolboxVisible && <Toolbox /> }
            </>
        }
    </>
);
    }
 
    _renderContentForReducedUi() {
        const { _connecting } = this.props;
 
        return (
            <>
                <LargeVideo onClick={this._onClick} />
                { _connecting &&
                    <TintedView>
                        <LoadingIndicator />
                    </TintedView>
                }
            </>
        );
    }
 
    _renderNotificationsContainer() {
        const notificationsStyle: ViewStyle = {};
        const { _aspectRatio, _filmstripVisible } = this.props;
 
        if (_filmstripVisible && _aspectRatio !== ASPECT_RATIO_NARROW) {
            notificationsStyle.marginRight = FILMSTRIP_SIZE;
        }
 
        return super.renderNotificationsContainer({
            shouldDisplayTileView: this.props._shouldDisplayTileView,
            style: notificationsStyle,
            toolboxVisible: this.props._toolboxVisible
        });
    }
 
    _setToolboxVisible(visible: boolean) {
        this.props.dispatch(setToolboxVisible(visible));
    }
}
 
function _mapStateToProps(state: IReduxState, _ownProps: any) {
    const { isOpen } = state['features/participants-pane'];
    const { aspectRatio, reducedUI } = state['features/base/responsive-ui'];
    const { backgroundColor } = state['features/dynamic-branding'];
    const { startCarMode } = state['features/base/settings'];
    const { enabled: audioOnlyEnabled } = state['features/base/audio-only'];
    const brandingStyles = backgroundColor ? { backgroundColor } : undefined;
 
    return {
        ...abstractMapStateToProps(state),
        _aspectRatio: aspectRatio,
        _audioOnlyEnabled: Boolean(audioOnlyEnabled),
        _brandingStyles: brandingStyles,
        _calendarEnabled: isCalendarEnabled(state),
        _connecting: isConnecting(state),
        _filmstripVisible: isFilmstripVisible(state),
        _fullscreenEnabled: getFeatureFlag(state, FULLSCREEN_ENABLED, true),
        _isDisplayNameVisible: isDisplayNameVisible(state),
        _isParticipantsPaneOpen: isOpen,
        _largeVideoParticipantId: state['features/large-video'].participantId,
        _pictureInPictureEnabled: isPipEnabled(state),
        _reducedUI: reducedUI,
        _showLobby: getIsLobbyVisible(state),
        _startCarMode: startCarMode,
        _toolboxVisible: isToolboxVisible(state)
    };
}
 
export default withSafeAreaInsets(connect(_mapStateToProps)(props => {
    const dispatch = useDispatch();
 
    useFocusEffect(useCallback(() => {
        dispatch({ type: CONFERENCE_FOCUSED });
        setPictureInPictureEnabled(true);
 
        return () => {
            dispatch({ type: CONFERENCE_BLURRED });
            setPictureInPictureEnabled(false);
        };
    }, []));
 
    return ( // @ts-ignore
        <Conference { ...props } />
    );
}));
 