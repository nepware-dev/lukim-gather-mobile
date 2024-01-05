import React, {useCallback, useEffect, useState} from 'react';
import {
    PermissionsAndroid,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    OutputFormatAndroidType,
    RecordBackType,
} from 'react-native-audio-recorder-player';
import DocumentPicker, {
    isInProgress,
    types,
} from 'react-native-document-picker';
import {Icon} from 'react-native-eva-icons';
import RNFetchBlob, {RNFetchBlobFile} from 'react-native-blob-util';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

import Audio from 'components/Audio';
import AnimatedAudioWave from 'components/Audio/wave';
import Button from 'components/Button';
import Modal from 'components/Modal';
import {_} from 'services/i18n';
import Toast from 'utils/toast';

import cs from '@rna/utils/cs';

import styles from './styles';
import COLORS from 'utils/colors';

interface AudioPickerProps {
    onAddAudio: (audio: any) => void;
    onRemoveAudio?(audio: null): void;
    audio: any;
}

interface AudioRecorderModalProps {
    isVisible: boolean;
    onChange: (audio: RNFetchBlobFile) => void;
    onBackdropPress: () => void;
}

interface RecordWelcomeScreenProps {
    onRecordPress: () => void;
}

interface RecordScreenProps {
    isRecording: boolean;
    pauseRecording: boolean;
    stopRecording: boolean;
    recordTime: string;
    currentVolume?: number;
    onRecordControlPress(): void;
    onRecordResetPress(): void;
    onRecordStopPress(): void;
}

const responseToFile = (res: any) => {
    const audio = {
        name: res.name,
        type: res.mime,
        uri: Platform.OS === 'ios' ? res.path.replace('file://', '') : res.path,
    };
    return audio;
};

const dirs = RNFetchBlob.fs.dirs;
const extension = Platform.OS === 'android' ? 'mp4' : 'm4a';
const fileName = `survey_recording_${Date.now()}.${extension}`;
const path = Platform.select({
    ios: fileName,
    android: `${dirs.CacheDir}/${fileName}`,
});

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordWelcomeScreen = ({onRecordPress}: RecordWelcomeScreenProps) => {
    return (
        <View style={styles.record}>
            <Pressable onPress={() => onRecordPress()}>
                <View style={styles.startRecordIcon}>
                    <Icon
                        name="mic-outline"
                        height={40}
                        width={40}
                        fill={COLORS.secondary}
                    />
                </View>
            </Pressable>
            <Text style={styles.text}>{_('Click to start recording')}</Text>
        </View>
    );
};

const RecordScreen = ({
    isRecording,
    pauseRecording,
    stopRecording,
    recordTime,
    currentVolume,
    onRecordControlPress,
    onRecordResetPress,
    onRecordStopPress,
}: RecordScreenProps) => {
    return (
        <View style={styles.recordContainer}>
            <Text style={styles.text}>
                {stopRecording
                    ? 'Stopped'
                    : isRecording && pauseRecording
                      ? _('Recording...')
                      : _('Paused')}
            </Text>
            <AnimatedAudioWave currentVolume={currentVolume} />
            <Text style={styles.txtRecordCounter}>{recordTime}</Text>
            <TouchableOpacity
                onPress={onRecordControlPress}
                disabled={stopRecording}>
                <Icon
                    name={pauseRecording ? 'pause-circle' : 'play-circle'}
                    height={53}
                    width={53}
                    fill={COLORS.secondary}
                    style={styles.recordIcon}
                />
            </TouchableOpacity>
            <View style={styles.buttonWrapper}>
                <Button
                    outline
                    style={styles.resetButton}
                    textStyle={styles.textStyle}
                    title={_('Reset')}
                    onPress={onRecordResetPress}
                />
                <Button
                    style={cs(
                        styles.stopButton,
                        [{backgroundColor: COLORS.secondary}],
                        stopRecording,
                    )}
                    title={stopRecording ? _('Done') : _('Stop recording')}
                    onPress={onRecordStopPress}
                />
            </View>
        </View>
    );
};

const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
    isVisible,
    onChange,
    onBackdropPress,
}) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [pauseRecording, setPauseRecording] = useState<boolean>(true);
    const [stopRecording, setStopRecording] = useState<boolean>(false);
    const [recordTime, setRecordTime] = useState<string>('00:00:00');
    const [audioFile, setAudioFile] = useState<RNFetchBlobFile | null>(null);
    const [currentVolume, setCurrentVolume] = useState<number | undefined>();

    const getPermissionAndroid = useCallback(async () => {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            if (
                grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true;
            } else {
                Toast.error(_('Permission required'));
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }, []);

    const getPermissionIOS = useCallback(async () => {
        try {
            await requestMultiple([PERMISSIONS.IOS.MICROPHONE]).then(res => {
                if (res['ios.permission.MICROPHONE'] === 'blocked') {
                    Toast.error(_('Permission required'));
                    return false;
                } else {
                    return true;
                }
            });
        } catch (err) {
            console.warn(err);
            return false;
        }
    }, []);

    const recordAudio = useCallback(async () => {
        if (!isRecording) {
            return;
        }

        try {
            if (Platform.OS === 'android') {
                const granted = await getPermissionAndroid();
                if (!granted) {
                    return;
                }
            }

            if (Platform.OS === 'ios') {
                await getPermissionIOS();
            }

            const audioSet: AudioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
                OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
            };

            const meteringEnabled = true;

            audioRecorderPlayer.setSubscriptionDuration(0.1);

            const uri = await audioRecorderPlayer.startRecorder(
                path,
                audioSet,
                meteringEnabled,
            );
            setAudioFile({
                path: uri,
                mime: 'audio/mpeg',
                name: fileName,
            });

            audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
                setRecordTime(
                    audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                );
                setCurrentVolume(e?.currentMetering);
            });
        } catch (error) {
            console.warn(error);
            return false;
        }
    }, [getPermissionAndroid, getPermissionIOS, isRecording]);

    useEffect(() => {
        if (!isRecording) {
            return;
        }
        recordAudio();
        return () => {
            audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
        };
    }, [isRecording, recordAudio]);

    const handleRecord = useCallback(() => {
        setStopRecording(false);
        setIsRecording(true);
    }, []);

    const handleRecordControl = useCallback(async () => {
        if (pauseRecording) {
            audioRecorderPlayer.pauseRecorder();
        } else {
            audioRecorderPlayer.resumeRecorder();
        }
        setPauseRecording(!pauseRecording);
    }, [pauseRecording]);

    const handleRecordReset = useCallback(async () => {
        try {
            await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
        } catch (error) {
            console.warn(error);
            return false;
        }
        setRecordTime('00:00:00');
        setIsRecording(false);
        setPauseRecording(true);
        setStopRecording(false);
    }, [setRecordTime, setPauseRecording, setStopRecording]);

    const handleRecordStop = useCallback(async () => {
        try {
            if (stopRecording) {
                setIsRecording(false);
                setStopRecording(false);
                if (audioFile) {
                    onChange?.(responseToFile(audioFile));
                }
                audioRecorderPlayer.removeRecordBackListener();
                onBackdropPress();
            } else {
                setStopRecording(true);
                setPauseRecording(false);
                await audioRecorderPlayer.stopRecorder();
            }
        } catch (error) {
            console.warn(error);
            return false;
        }
    }, [onBackdropPress, stopRecording, audioFile, onChange]);

    const handleClose = useCallback(async () => {
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
        setPauseRecording(false);
        setStopRecording(false);
        onBackdropPress();
    }, [onBackdropPress]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleClose}
            style={styles.modal}>
            <View style={styles.modalContent}>
                <TouchableOpacity onPress={handleClose}>
                    <View style={styles.modalResponder} />
                </TouchableOpacity>
                {isRecording ? (
                    <RecordScreen
                        isRecording={isRecording}
                        pauseRecording={pauseRecording}
                        stopRecording={stopRecording}
                        recordTime={recordTime}
                        currentVolume={currentVolume}
                        onRecordControlPress={handleRecordControl}
                        onRecordResetPress={handleRecordReset}
                        onRecordStopPress={handleRecordStop}
                    />
                ) : (
                    <RecordWelcomeScreen onRecordPress={() => handleRecord()} />
                )}
            </View>
        </Modal>
    );
};

const _AudioPicker: React.FC<AudioPickerProps> = ({
    onAddAudio: onChangeCallback,
    onRemoveAudio: onRemoveCallback,
    audio,
}) => {
    const [audioRecordVisible, setAudioRecordVisible] =
        useState<boolean>(false);

    const getPermissionAndroid = useCallback(async () => {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]);

            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true;
            } else {
                Toast.error(_('Permission required'));
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }, []);

    const RecordAudio = useCallback(() => {
        setAudioRecordVisible(!audioRecordVisible);
    }, [audioRecordVisible]);

    const close = useCallback(() => {
        setAudioRecordVisible(false);
    }, []);

    const onChange = useCallback(
        (response: RNFetchBlobFile) => {
            onChangeCallback(response);
        },
        [onChangeCallback],
    );

    const handleError = useCallback((err: unknown) => {
        if (DocumentPicker.isCancel(err)) {
            console.warn('cancelled');
        } else if (isInProgress(err)) {
            console.warn(
                'multiple pickers were opened, only the last will be considered',
            );
        } else {
            throw err;
        }
    }, []);

    const handleAudioSelection = useCallback(async () => {
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }

        try {
            const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
                type: types.audio,
            });
            onChange?.(
                responseToFile({
                    path: pickerResult.fileCopyUri,
                    mime: pickerResult.type,
                    name: pickerResult.name,
                    size: pickerResult.size,
                }),
            );
        } catch (e) {
            handleError(e);
        }
    }, [handleError, getPermissionAndroid, onChange]);

    return audio ? (
        <Audio audio={audio} onRemoveAudio={onRemoveCallback} />
    ) : (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.recordOption}
                    onPress={RecordAudio}>
                    <Icon
                        name="mic-outline"
                        height={20}
                        width={20}
                        fill={'#99B9D1'}
                        style={styles.recordOptionIcon}
                    />
                    <Text style={styles.recordOptionText}>
                        {_('Record audio')}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.recordChoice}>{_('OR')}</Text>
                <TouchableOpacity
                    style={styles.recordOption}
                    onPress={handleAudioSelection}>
                    <Icon
                        name="upload-outline"
                        height={20}
                        width={20}
                        fill={'#99B9D1'}
                        style={styles.recordOptionIcon}
                    />
                    <Text style={styles.recordOptionText}>
                        {_('Upload audio')}
                    </Text>
                </TouchableOpacity>
            </View>
            <AudioRecorderModal
                isVisible={audioRecordVisible}
                onBackdropPress={close}
                onChange={onChange}
            />
        </>
    );
};

export default _AudioPicker;
