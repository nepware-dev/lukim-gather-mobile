import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player';
import { Icon } from 'react-native-eva-icons';

import styles from './styles';
import COLORS from 'utils/colors';

interface AudioProps {
    audio: {
        uri: string;
        name: string;
        [propName: string]: any;
    };
    onRemoveAudio?(audio: null): void;
    isStatic?: boolean;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

export const _Audio: React.FC<AudioProps> = ({
    audio,
    onRemoveAudio,
    isStatic,
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
        };
    }, []);

    const onStartPlay = useCallback(async () => {
        try {
            await audioRecorderPlayer.startPlayer(
                audio?.uri || (audio as unknown as string),
            );
            audioRecorderPlayer.setVolume(1.0);
            audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
                if (e.currentPosition === e.duration) {
                    setIsPlaying(false);
                }
            });
            setIsPlaying(true);
        } catch (err) {
            console.warn(err);
        }
    }, [audio]);

    const onRestartPlay = useCallback(async () => {
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        onStartPlay();
        setIsPaused(false);
    }, [onStartPlay, setIsPaused]);

    const onPausePlay = useCallback(async () => {
        await audioRecorderPlayer
            .pausePlayer()
            .then(() => {
                setIsPaused(true);
            })
            .catch(err => {
                onRestartPlay();
                console.warn(err);
            });
    }, [onRestartPlay]);

    const onResumePlay = useCallback(async () => {
        await audioRecorderPlayer
            .resumePlayer()
            .then(() => {
                setIsPaused(false);
            })
            .catch(err => {
                onRestartPlay();
                console.warn(err);
            });
    }, [onRestartPlay]);

    const handlePlayer = useCallback(() => {
        if (!isPlaying) {
            onStartPlay();
        } else if (isPaused) {
            onResumePlay();
        } else {
            onPausePlay();
        }
    }, [isPlaying, isPaused, onStartPlay, onPausePlay, onResumePlay]);

    const handleRemoveAudio = useCallback(async () => {
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        onRemoveAudio && onRemoveAudio(null);
    }, [onRemoveAudio]);

    const playStatusIcon = isPlaying
        ? isPaused
            ? 'play-circle'
            : 'pause-circle'
        : 'play-circle';

    return (
        <View style={styles.container}>
            <View style={styles.audioContainer}>
                <View style={styles.audioWrapper}>
                    <TouchableOpacity onPress={handlePlayer}>
                        <Icon
                            name={playStatusIcon}
                            height={40}
                            width={40}
                            fill={COLORS.blueText}
                            style={styles.audioIcon}
                        />
                    </TouchableOpacity>
                    <Text
                        style={styles.audioTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {audio?.name || audio?.substring(audio.lastIndexOf('/') + 1)}
                    </Text>
                </View>
                {!isStatic && (
                    <TouchableOpacity onPress={handleRemoveAudio}>
                        <Icon
                            name={'trash-2-outline'}
                            height={30}
                            width={30}
                            fill={COLORS.greyText}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default _Audio;
