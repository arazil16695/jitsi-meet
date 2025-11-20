import React, { ReactNode, useRef } from 'react';
import {
    Animated,
    PanResponder,
    StyleSheet,
    Dimensions,
    ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    children: ReactNode;
    style?: ViewStyle;
}

export default function DraggableCameraView({ children, style }: Props) {

    const insets = useSafeAreaInsets();

    /** CAMERA SIZE */
    const CAMERA_WIDTH = 160;
    const CAMERA_HEIGHT = 120;

    /** TITLEBAR HEIGHT */
    const TITLEBAR_HEIGHT = 60;

    /** TOTAL SAFE TOP (Notch + TitleBar) */
    const SAFE_TOP = insets.top + TITLEBAR_HEIGHT;

    /** TOOLBAR HEIGHT */
    const TOOLBAR_HEIGHT = 110;

    /** Starting position BELOW title bar */
    const position = useRef(
        new Animated.ValueXY({
            x: SCREEN_WIDTH - CAMERA_WIDTH - 10,
            y: SAFE_TOP + 10
        })
    ).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                position.setOffset({
                    x: (position.x as any)._value,
                    y: (position.y as any)._value
                });
                position.setValue({ x: 0, y: 0 });
            },

            onPanResponderMove: Animated.event(
                [null, { dx: position.x, dy: position.y }],
                { useNativeDriver: false }
            ),

            onPanResponderRelease: () => {
                position.flattenOffset();

                let x = (position.x as any)._value;
                let y = (position.y as any)._value;

                /** LIMITS */
                const LEFT = 0;
                const RIGHT = SCREEN_WIDTH - CAMERA_WIDTH;

                const TOP = SAFE_TOP; // ⬅️ dynamic safe area + titlebar
                const BOTTOM = SCREEN_HEIGHT - TOOLBAR_HEIGHT - CAMERA_HEIGHT - 2;

                x = Math.min(Math.max(x, LEFT), RIGHT);
                y = Math.min(Math.max(y, TOP), BOTTOM);

                Animated.spring(position, {
                    toValue: { x, y },
                    useNativeDriver: false
                }).start();
            }
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    transform: position.getTranslateTransform(),
                    width: CAMERA_WIDTH,
                    height: CAMERA_HEIGHT
                },
                style
            ]}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderRadius: 8,
        overflow: 'hidden',
        zIndex: 9999,
        elevation: 10
    }
});
