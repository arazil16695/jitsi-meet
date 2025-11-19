// DraggableCameraView.tsx (Native only, TSX)
import React, { ReactNode, useRef } from 'react';
import {
    Animated,
    PanResponder,
    StyleSheet,
    Dimensions,
    ViewStyle
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    children: ReactNode;
    style?: ViewStyle;
}

export default function DraggableCameraView({ children, style }: Props) {
    const position = useRef(
        new Animated.ValueXY({ x: SCREEN_WIDTH - 170, y: 100 })
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

                // keep inside screen
                x = Math.min(Math.max(0, x), SCREEN_WIDTH - 170);
                y = Math.min(Math.max(0, y), SCREEN_HEIGHT - 200);

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
                { transform: position.getTranslateTransform() },
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
        width: 157,
        height: 160,
        backgroundColor: 'transparent',
        borderRadius: 8,
        overflow: 'hidden',
        zIndex: 9999,
        elevation: 10
    }
});