import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, useSelector } from 'react-redux';
import { IStore, IReduxState } from '../../../app/types';  // Ensure correct imports
import { iAmVisitor } from '../../../visitors/functions'; 
import { customButtonPressed } from '../../actions.native';
import { getVisibleNativeButtons, isToolboxVisible } from '../../functions.native';
import { useNativeToolboxButtons } from '../../hooks.native'; 
import { IToolboxNativeButton } from '../../types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';  // Correct import
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
    const { mainToolbarButtonsThresholds, toolbarButtons } = useSelector((state: IReduxState) => state['features/toolbox']);
    const allButtons = useNativeToolboxButtons(customToolbarButtons);
    const { mainMenuButtons } = getVisibleNativeButtons({
        allButtons,
        clientWidth,
        iAmVisitor: _iAmVisitor,
        mainToolbarButtonsThresholds,
        toolbarButtons
    });
    const bottomEdge = Platform.OS === 'ios' && _visible;
    const { buttonStylesBorderless, hangupButtonStyles , overFlowmenuStyle , viewStyle} = _styles;
    const style = {
      ...styles.toolbox,
      backgroundColor: '#373737',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 70, 
      padding: 10, 
      marginLeft: 10,
      marginRight: 10,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12
    } as ViewStyle;
    // Function to render toolbox buttons
    const renderToolboxButtons = () => {
    if (!mainMenuButtons?.length) {
        return null;
    }

    return (
        <>
            {mainMenuButtons.map(({ Content, key, text, ...rest }: IToolboxNativeButton, index) => (
                <React.Fragment key={key}>
                    {/* Render the button */}
                    <View
                        style={{
                            backgroundColor: '#00000000',
                            height: 50,
                            width: 50,
                            padding: 4,
                            borderRadius: 24,
                            marginHorizontal: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Content
                            {...rest}
                            handleClick={() => dispatch(customButtonPressed(key, text))}
                            isToolboxButton={true}
                            styles={key === 'hangup' ? hangupButtonStyles
                                : key === 'overflowmenu' ? overFlowmenuStyle
                                    : key === 'chat' ? viewStyle
                                        : buttonStylesBorderless}
                        />
                    </View>

                    {/* Conditionally render vertical line between overflowmenu and hangup buttons */}
                    {key === 'overflowmenu' && (
                        <View
                            style={{
                                width: 1,  // Vertical line thickness
                                height: 30,  // Same height as the button
                                backgroundColor: '#4E504F', 
                                marginLeft:-30 // Line color (adjust as needed)
  // Space between the button and the line// Space between the line and the next button
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </>
    );
};
    return (
        <View style={{ flex: 1 }}>
            {/* Render the camera and other content */}
            <View style={{ flex: 1 }}>
                {/* Your camera content */}
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
                }}>
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