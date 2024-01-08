import React, {useEffect, useCallback} from 'react';
import {View, Animated} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import styles from './styles';
import COLORS from 'utils/colors';

interface AnimatedAudioWaveProps {
    currentVolume?: number;
}

interface MapRangeProps {
    value: number;
    oldMin: number;
    oldMax: number;
    newMin: number;
    newMax: number;
}

const mapRange = ({
    value,
    oldMin,
    oldMax,
    newMin,
    newMax,
}: MapRangeProps): number => {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
};

const AnimatedAudioWave = ({currentVolume}: AnimatedAudioWaveProps) => {
    const maxVolume = 60;
    const volume = Math.floor(
        mapRange({
            value: currentVolume ?? -60,
            oldMin: -60,
            oldMax: 0,
            newMin: 0,
            newMax: 60,
        }),
    );

    const animationRef = React.useRef(new Animated.Value(0)).current;

    const startAnimation = useCallback(() => {
        Animated.timing(animationRef, {
            toValue: volume / maxVolume,
            useNativeDriver: true,
            duration: 50,
        }).start();
    }, [animationRef, volume]);

    useEffect(() => {
        startAnimation();
    }, [startAnimation]);

    const scale = animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
        extrapolate: 'clamp',
    });
    return (
        <View style={styles.riplerContainer}>
            <View style={styles.riplerContent}>
                <Animated.View
                    style={[
                        styles.ripler,
                        {
                            transform: [
                                {
                                    scale: scale,
                                },
                            ],
                        },
                    ]}
                />
                <View style={styles.riplerIconContainer}>
                    <Icon
                        name="mic-outline"
                        height={40}
                        width={40}
                        fill={COLORS.secondary}
                    />
                </View>
            </View>
        </View>
    );
};

export default AnimatedAudioWave;
