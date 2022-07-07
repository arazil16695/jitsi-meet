import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import JitsiScreen from '../../../../base/modal/components/JitsiScreen';
import { LoadingIndicator, TintedView } from '../../../../base/react';
import { isLocalVideoTrackDesktop } from '../../../../base/tracks';
import { setPictureInPictureEnabled } from '../../../../mobile/picture-in-picture/functions';
import { setIsCarmode } from '../../../../video-layout/actions';
import ConferenceTimer from '../../ConferenceTimer';
import { isConnecting } from '../../functions';

import CarModeFooter from './CarModeFooter';
import MicrophoneButton from './MicrophoneButton';
import TitleBar from './TitleBar';
import styles from './styles';

/**
 * Implements the carmode component.
 *
 * @returns { JSX.Element} - The carmode component.
 */
const CarMode = (): JSX.Element => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const connecting = useSelector(isConnecting);
    const isSharing = useSelector(isLocalVideoTrackDesktop);

    useEffect(() => {
        dispatch(setIsCarmode(true));
        setPictureInPictureEnabled(false);

        return () => {
            dispatch(setIsCarmode(false));
            if (!isSharing) {
                setPictureInPictureEnabled(true);
            }
        };
    }, []);

    return (
        <JitsiScreen
            footerComponent = { CarModeFooter }
            style = { styles.conference }>
            {/*
                  * The activity/loading indicator goes above everything, except
                  * the toolbox/toolbars and the dialogs.
                  */
                connecting
                && <TintedView>
                    <LoadingIndicator />
                </TintedView>
            }
            <View
                pointerEvents = 'box-none'
                style = { styles.titleBarSafeViewColor }>
                <View
                    style = { styles.titleBar }>
                    <TitleBar />
                </View>
                <ConferenceTimer textStyle = { styles.roomTimer } />
            </View>
            <View
                pointerEvents = 'box-none'
                style = { styles.microphoneContainer }>
                <MicrophoneButton />
            </View>
        </JitsiScreen>
    );
};

export default withSafeAreaInsets(CarMode);
