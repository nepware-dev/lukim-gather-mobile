import React from 'react';
import {Image, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import styles from './styles';

interface Props {
    imageUrl: string;
    style?: object;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const {width, height} = Dimensions.get('window');

const ZoomAbleImage = ({imageUrl, style, ...imageProps}: Props) => {
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);

    const pinchHandler = Gesture.Pinch()
        .onUpdate(event => {
            scale.value = event.scale;
            focalX.value = event.focalX;
            focalY.value = event.focalY;
        })
        .onEnd(() => {
            scale.value = withTiming(1);
        });

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: focalX.value},
                {translateY: focalY.value},
                {translateX: -width / 2},
                {translateY: -height / 2},
                {scale: scale.value},
                {translateX: -focalX.value},
                {translateY: -focalY.value},
                {translateX: width / 2},
                {translateY: height / 2},
            ],
        };
    });

    return (
        <GestureDetector gesture={pinchHandler}>
            <Animated.View style={styles.container}>
                <AnimatedImage
                    source={{uri: imageUrl}}
                    style={[rStyle, style]}
                    {...imageProps}
                />
            </Animated.View>
        </GestureDetector>
    );
};

export default ZoomAbleImage;
