import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, useSelector } from 'react-redux';
 
import { IReduxState, IStore } from '../../../app/types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import Platform from '../../../base/react/Platform.native';
import { iAmVisitor } from '../../../visitors/functions';
import { customButtonPressed } from '../../actions.native';
import { getVisibleNativeButtons, isToolboxVisible } from '../../functions.native';
import { useNativeToolboxButtons } from '../../hooks.native';
import { IToolboxNativeButton } from '../../types';
 
import styles from './styles';
 
interface IProps {
    _iAmVisitor: boolean;
    _styles: any;
    toolboxVisible: boolean;  // Accept toolboxVisible as a prop from the parent (Conference.tsx)
    dispatch: IStore['dispatch'];
}
 
function Toolbox(props: IProps) {
    const { _iAmVisitor, _styles, toolboxVisible, dispatch } = props;
 
    // Early return if toolbox is not visible
    if (!toolboxVisible) {
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
 
    const bottomEdge = Platform.OS === 'ios' && toolboxVisible;
    const { buttonStylesBorderless, hangupButtonStyles } = _styles;
 
    const style = {
        ...styles.toolbox,
        backgroundColor: '#075e54aa',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    } as ViewStyle;
 
    const renderToolboxButtons = () => {
        if (!mainMenuButtons?.length) {
            return null;
        }
 
        const filteredButtons = mainMenuButtons.filter(({ key }: IToolboxNativeButton) =>
            key !== 'chat' && key !== 'overflowmenu' && key !== 'invite'
        );
 
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
                            justifyContent: 'center',
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
        <View style={styles.toolboxContainer as ViewStyle}>
            <SafeAreaView
                accessibilityRole="toolbar"
                edges={[bottomEdge && 'bottom'].filter(Boolean)}
                pointerEvents="box-none"
                style={style}>
                {renderToolboxButtons()}
            </SafeAreaView>
        </View>
    );
}
 
function _mapStateToProps(state: IReduxState) {
    return {
        _iAmVisitor: iAmVisitor(state),
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
    };
}
 
export default connect(_mapStateToProps)(Toolbox);
 