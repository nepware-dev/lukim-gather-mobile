import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, Modal, TouchableOpacity, Dimensions} from 'react-native';
import {
    FlatList,
    GestureHandlerRootView,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNetInfo} from '@react-native-community/netinfo';

import Text from 'components/Text';
import ZoomAbleImage from 'components/Image';

import type {GalleryType} from '@generated/types';

import COLORS from 'utils/colors';
import {_} from 'services/i18n';

import styles from './styles';

interface ImageProps {
    images: GalleryType[];
}

interface PhotoProps {
    isVisible: boolean;
    items: GalleryType[];
    selectedIndex: number | null;
    onClose: () => void;
}

const EmptyImageList = () => (
    <Text style={styles.text} title={_('No images uploaded')} />
);

const {width} = Dimensions.get('window');

const ImageItem: React.FC<{
    item: GalleryType;
    onPress: (item: GalleryType) => void;
    index: number;
}> = ({item, onPress, index}) => {
    const {isInternetReachable} = useNetInfo();

    const handlePress = useCallback(() => {
        onPress(index);
    }, [onPress, index]);

    const [error, setError] = useState<string | null>(null);

    const handleImageError = useCallback(() => {
        if (!isInternetReachable) {
            setError(_('Cannot load image while offline!'));
        } else {
            setError(_('Error loading image!'));
        }
    }, [isInternetReachable]);

    const handleImageLoad = useCallback(() => setError(null), []);

    return (
        <View style={styles.imageContainer}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <Image
                    source={
                        {uri: item?.mediaAsset?.sm as string} ||
                        require('assets/images/category-placeholder.png')
                    }
                    style={styles.images}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
                {Boolean(error) && (
                    <View style={styles.errorTextContainer}>
                        <Text title={error} style={styles.errorText} />
                    </View>
                )}
            </TouchableWithoutFeedback>
        </View>
    );
};

const ImageModal: React.FC<PhotoProps> = ({
    isVisible,
    items,
    selectedIndex,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(
        selectedIndex,
    );

    useEffect(() => {
        setCurrentIndex(selectedIndex);
    }, [selectedIndex]);

    return (
        <Modal
            animationType="slide"
            visible={isVisible}
            presentationStyle="fullScreen"
            onRequestClose={() => {
                onClose();
            }}>
            <GestureHandlerRootView style={{flex: 1}}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => onClose()}
                        style={styles.closeIcon}>
                        <Icon
                            name="close-outline"
                            height={30}
                            width={30}
                            fill={COLORS.tertiary}
                        />
                    </TouchableOpacity>
                    <FlatList
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        horizontal
                        initialScrollIndex={currentIndex}
                        onScroll={e => {
                            const x = e.nativeEvent.contentOffset.x;
                            setCurrentIndex(Math.round(x / width));
                        }}
                        data={items}
                        renderItem={({item, index}) => {
                            return (
                                <ZoomAbleImage
                                    imageUrl={
                                        item?.mediaAsset?.og || item.media
                                    }
                                    style={styles.image}
                                    key={index}
                                />
                            );
                        }}
                    />
                    <View style={styles.imageFooterContainer}>
                        <Text
                            style={styles.imageFooterText}
                            title={`${(currentIndex ?? 0) + 1} / ${
                                items.length
                            }`}
                        />
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const ImageView: React.FC<ImageProps> = ({images}) => {
    const [openGallery, setOpenGallery] = useState<boolean>(false);
    const [selectedIndex, setSeletedIndex] = useState<number | null>(null);

    const handleImage = useCallback(
        (index: number) => {
            setOpenGallery(!openGallery);
            setSeletedIndex(index);
        },
        [openGallery],
    );

    const handleClose = useCallback(() => {
        setOpenGallery(false);
        setSeletedIndex(null);
    }, []);

    const renderImage = useCallback(
        renderProps => <ImageItem {...renderProps} onPress={handleImage} />,
        [handleImage],
    );

    return (
        <>
            <FlatList
                data={images}
                renderItem={renderImage}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={EmptyImageList}
                removeClippedSubviews={true}
            />
            <ImageModal
                items={images}
                isVisible={openGallery}
                selectedIndex={selectedIndex}
                onClose={() => handleClose()}
            />
        </>
    );
};

export default ImageView;
