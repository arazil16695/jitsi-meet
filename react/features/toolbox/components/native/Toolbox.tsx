import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, useSelector } from 'react-redux';

import { IReduxState, IStore } from '../../../app/types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import { iAmVisitor } from '../../../visitors/functions';
import { customButtonPressed } from '../../actions.native';
import { getVisibleNativeButtons, isToolboxVisible } from '../../functions.native';
import { useNativeToolboxButtons } from '../../hooks.native';
import { IToolboxNativeButton } from '../../types';

import styles from './styles';

interface IProps {
    _iAmVisitor: boolean;
    _styles: any;
    _visible: boolean;
    dispatch: IStore['dispatch'];
}

function Toolbox(props: IProps) {
    const { _iAmVisitor, _styles, _visible, dispatch } = props;

    if (!_visible) {
        return null;
    }

    const { clientWidth } = useSelector((state: IReduxState) => state['features/base/responsive-ui']);
    const { customToolbarButtons } = useSelector((state: IReduxState) => state['features/base/config']);
    const {
        mainToolbarButtonsThresholds,
        toolbarButtons
    } = useSelector((state: IReduxState) => state['features/toolbox']);

    const allButtons = useNativeToolboxButtons(customToolbarButtons);

    const { mainMenuButtons } = getVisibleNativeButtons({
        allButtons,
        clientWidth,
        iAmVisitor: _iAmVisitor,
        mainToolbarButtonsThresholds,
        toolbarButtons
    });

    const bottomEdge = Platform.OS === 'ios' && _visible;
    const { buttonStylesBorderless, hangupButtonStyles } = _styles;

    const style = {
      ...styles.toolbox,
      backgroundColor: '#075e54aa',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60, 
      padding: 10, 
      marginLeft: 10,
      marginRight: 10,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12
    } as ViewStyle;

    const renderToolboxButtons = () => {
        if (!mainMenuButtons?.length) {
            return null;
        }

        const filteredButtons = mainMenuButtons;

        return (
            <>
                {filteredButtons.map(({ Content, key, text, ...rest }: IToolboxNativeButton) => (
                    <View
                        key={key}
                        style={{
                            backgroundColor: key === 'hangup' ? '#00000000' : '#00000000',
                            height: key === 'hangup' ? 50 : 40,
                            width: key === 'hangup' ? 50 : 40,
                            padding: key === 'hangup' ? 4 : 7, 
                            borderRadius: 24, 
                            marginHorizontal: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Content
                            {...rest}
                            handleClick={() => dispatch(customButtonPressed(key, text))}
                            isToolboxButton={true}
                            styles={key === 'hangup' ? hangupButtonStyles : buttonStylesBorderless}
                        />
                    </View>
                ))}
            </>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Render the camera and other content */}
            <View style={{ flex: 1 }}>
                {/* This is where your camera or other content will be displayed */}
                {/* Ensure camera and top bar are part of the content */}
            </View>

            {/* Bottom bar section */}
            <SafeAreaView
                accessibilityRole="toolbar"
                edges={bottomEdge ? ['bottom'] : []}
                pointerEvents="box-none"
                style={{
                    position: 'absolute', // Fix the bottom bar at the bottom
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1, // Ensure the bottom bar is above other elements
                    paddingBottom: 20 // Optional, adjust if necessary
                }}
            >
                <View style={style}>
                    {renderToolboxButtons()}
                </View>
            </SafeAreaView>
        </View>
    );
}

function _mapStateToProps(state: IReduxState) {
    return {
        _iAmVisitor: iAmVisitor(state),
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
    };
}

export default connect(_mapStateToProps)(Toolbox);
