import React, {useCallback, useRef, useMemo} from 'react';
import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Image,
    FlatList,
} from 'react-native';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import {Icon} from 'react-native-eva-icons';

import Modal from 'components/Modal';
import {_} from 'services/i18n';

import cs from '@rna/utils/cs';

import type {GalleryType} from '@generated/types';

import styles from './styles';

interface PhotoProps {
    item: {
        path?: string;
        isStatic?: boolean;
        media?: string | null;
        uri?: string;
    };
    index: number;
    onCloseIconPress(index: number): void;
    isStatic?: boolean;
}

interface PhotosProps {
    photos: PhotoProps['item'][];
    onRemoveImage(index: number): void;
    isStatic?: boolean;
}

interface ImagePickerProps {
    images: ImageType[];
    onAddImage: (file: ImageType) => void;
    onRemoveImage: (images: ImageType[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    initialImages?: GalleryType[];
}

interface ImagePickerModalProps {
    onChange: (file: ImageType) => void;
    multiple?: boolean;
    isVisible: boolean;
    onBackdropPress(): void;
}

const Photo: React.FC<PhotoProps> = ({item, index, onCloseIconPress}) => {
    const handleCloseIconPress = useCallback(() => {
        onCloseIconPress(index);
    }, [index, onCloseIconPress]);

    return (
        <View style={styles.surveyImageWrapper}>
            <Image
                source={
                    {uri: item.media || item.path || item.uri} ||
                    require('assets/images/category-placeholder.png')
                }
                style={cs(styles.surveyImage, [
                    styles.surveyImageStatic,
                    item.isStatic,
                ])}
            />
            {!item.isStatic && (
                <Pressable
                    style={styles.closeIcon}
                    onPress={handleCloseIconPress}>
                    <Icon
                        name="close-circle"
                        height={20}
                        width={20}
                        fill={'#fff'}
                    />
                </Pressable>
            )}
        </View>
    );
};

const Photos: React.FC<PhotosProps> = ({photos, onRemoveImage}) => {
    const listRef = useRef<FlatList>(null);
    const handleCloseIcon = useCallback(
        (index: number) => {
            onRemoveImage(index);
            listRef.current?.scrollToIndex({animated: true, index: 0});
        },
        [onRemoveImage],
    );

    const renderItem = useCallback(
        ({item, index}: {item: PhotoProps['item']; index: number}) => (
            <Photo
                item={item}
                index={index}
                onCloseIconPress={handleCloseIcon}
            />
        ),
        [handleCloseIcon],
    );
    return (
        <FlatList
            ref={listRef}
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    onChange,
    multiple,
    isVisible,
    onBackdropPress,
}) => {
    const handleCamera = useCallback(async () => {
        try {
            const image = await ImagePicker.openCamera({
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.7,
                multiple,
            });
            if (image) {
                onChange?.(image);
            }
        } catch (error) {}
    }, [multiple, onChange]);

    const handleGallery = useCallback(async () => {
        try {
            const image = await ImagePicker.openPicker({
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.7,
                multiple,
            });
            if (image) {
                onChange?.(image);
            }
        } catch (error) {}
    }, [onChange, multiple]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            style={styles.modal}>
            <View style={styles.options}>
                <Pressable style={styles.option} onPress={handleGallery}>
                    <Icon
                        name="image"
                        height={25}
                        width={25}
                        fill={'#284362'}
                    />
                    <Text style={styles.optionText}>{_('Gallery')}</Text>
                </Pressable>
                <Pressable style={styles.option} onPress={handleCamera}>
                    <Icon
                        name="camera"
                        height={25}
                        width={25}
                        fill={'#284362'}
                    />
                    <Text style={styles.optionText}>{_('Camera')}</Text>
                </Pressable>
            </View>
        </Modal>
    );
};

const _ImagePicker: React.FC<ImagePickerProps> = ({
    images,
    onAddImage: onChangeCallback,
    multiple,
    onRemoveImage: onRemoveCallback,
    disabled,
    initialImages = [],
}) => {
    const [visible, setVisible] = React.useState(false);

    const allImages = useMemo(() => {
        return [
            ...images,
            ...initialImages.map(ii => ({...ii, isStatic: true})),
        ];
    }, [images, initialImages]);

    const iconFlex = useRef(
        new Animated.Value(allImages.length >= 1 ? 0.2 : 1),
    ).current;
    const imgFlex = useRef(
        new Animated.Value(allImages.length >= 1 ? 1 : 0),
    ).current;

    const close = useCallback(() => {
        setVisible(false);
    }, []);

    const open = useCallback(() => {
        setVisible(true);
    }, []);

    const onChange = useCallback(
        response => {
            if ((multiple && response.length >= 1) || allImages.length === 1) {
                Animated.timing(iconFlex, {
                    toValue: 0.2,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            if (allImages.length === 0) {
                Animated.timing(imgFlex, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            onChangeCallback(response);
            close();
        },
        [
            multiple,
            allImages.length,
            onChangeCallback,
            close,
            iconFlex,
            imgFlex,
        ],
    );

    const onRemoveImage = useCallback(
        (index: number) => {
            const newImages = images.filter(
                (_: ImageType, i: number) => i !== index,
            );

            if (newImages.length === 1) {
                Animated.timing(iconFlex, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            if (newImages.length === 0) {
                Animated.timing(imgFlex, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            onRemoveCallback(newImages);
        },
        [onRemoveCallback, images, iconFlex, imgFlex],
    );

    return (
        <>
            <View style={styles.addImages}>
                <Animated.View style={cs({flex: imgFlex})}>
                    <Photos photos={allImages} onRemoveImage={onRemoveImage} />
                </Animated.View>
                {(multiple || allImages.length !== 1) && (
                    <Animated.View
                        style={cs(styles.imgPickerWrapper, {flex: iconFlex})}>
                        <TouchableOpacity
                            style={
                                allImages.length < 1 && styles.emptyAddWrapper
                            }
                            onPress={open}
                            disabled={disabled}>
                            <Icon
                                name="plus-circle"
                                height={40}
                                width={40}
                                fill={'#99B9D1'}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
            <ImagePickerModal
                isVisible={visible}
                onBackdropPress={close}
                onChange={onChange}
                multiple
            />
        </>
    );
};

export default _ImagePicker;
