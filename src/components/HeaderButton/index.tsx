import React, {useCallback} from 'react';
import {Keyboard, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import COLORS from 'utils/colors';

import styles from './styles';

export const BackButton = () => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => {
        Keyboard.dismiss();
        navigation.goBack();
    }, [navigation]);
    return (
        <TouchableOpacity onPress={onBackPress} style={styles.headerIcon}>
            <Icon
                name="arrow-ios-back-outline"
                height={30}
                width={30}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const CloseButton = ({onClose}: {onClose?: () => void}) => {
    const navigation = useNavigation();
    const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
    return (
        <TouchableOpacity
            onPress={onClose || onBackPress}
            style={styles.headerIcon}>
            <Icon
                name="close-outline"
                height={30}
                width={30}
                fill={COLORS.tertiary}
            />
        </TouchableOpacity>
    );
};

export const SaveButton = ({onSavePress}: {onSavePress(): void}) => {
    return (
        <TouchableOpacity onPress={onSavePress} style={styles.headerIcon}>
            <Icon
                name="checkmark-circle-2"
                height={30}
                width={30}
                fill={COLORS.accent}
            />
        </TouchableOpacity>
    );
};

export const OptionIcon = ({onOptionPress}: {onOptionPress(): void}) => {
    return (
        <TouchableOpacity onPress={onOptionPress} style={styles.headerIcon}>
            <Icon
                name="more-horizontal-outline"
                height={30}
                width={30}
                fill={'#000'}
            />
        </TouchableOpacity>
    );
};

export const SearchIcon = ({onSearchPress}: {onSearchPress(): void}) => {
    return (
        <TouchableOpacity onPress={onSearchPress} style={styles.headerIcon}>
            <Icon
                name="search-outline"
                height={30}
                width={30}
                fill={COLORS.greyTextDark}
            />
        </TouchableOpacity>
    );
};

export const NotificationIcon = ({
    onNotificationPress,
    unReadCount,
}: {
    onNotificationPress(): void;
    unReadCount: number;
}) => {
    return (
        <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.headerIcon}>
            {unReadCount > 0 && (
                <View style={styles.notificationCount}>
                    {unReadCount < 10 && (
                        <Text
                            style={styles.count}
                            title={unReadCount}
                        />
                    )}
                </View>
            )}
            <Icon
                name="bell-outline"
                height={25}
                width={25}
                fill={COLORS.grey200}
            />
        </TouchableOpacity>
    );
};
