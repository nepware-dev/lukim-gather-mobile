import {formatDistanceToNow} from 'date-fns';
import React, {useCallback, useState} from 'react';
import {
    FlatList,
    Image,
    ListRenderItem,
    RefreshControl,
    View,
    TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Text from 'components/Text';

import useQuery from 'hooks/useQuery';
import {
    GET_NOTIFICATIONS,
    GET_HAPPENING_SURVEY,
    MARK_AS_READ,
} from 'services/gql/queries';
import {NotificationType} from '@generated/types';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import Toast from 'utils/toast';

import COLORS from 'utils/colors';
import styles from './styles';

const NoNotification = () => {
    return (
        <View style={styles.emptyWrapper}>
            <Image
                style={styles.emptyIcon}
                source={require('assets/icons/no-notification.png')}
            />
            <Text
                style={styles.emptyTitle}
                title="Oops! No Notification Found"
            />
            <Text
                style={styles.emptyMessage}
                title="You currently have no notifications. We'll notify you when something new arrives."
            />
        </View>
    );
};

type IconType = {
    happening_survey_approved: string;
    happening_survey_rejected: string;
    default: string;
};

const icons: IconType = {
    happening_survey_approved: 'checkmark-outline',
    happening_survey_rejected: 'close-outline',
    default: 'file-text-outline',
};

type KeyExtractor = (item: NotificationType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id;

const Notifications = () => {
    const {loading, data, refetch} = useQuery(GET_NOTIFICATIONS);
    const [getHappeningSurvey] = useLazyQuery(GET_HAPPENING_SURVEY);
    const [markAsRead, {loading: markAsReadStatus}] = useMutation(MARK_AS_READ);
    const [isScreenBlurred, setIsScreenBlurred] = useState(false);
    const navigation = useNavigation();

    const handleRefresh = useCallback(() => {
        refetch();
        setIsScreenBlurred(false);
        const unsubscribe = navigation.addListener('blur', () => {
            setIsScreenBlurred(true);
        });
        return () => unsubscribe();
    }, [refetch]);

    useFocusEffect(handleRefresh);

    const handleNotificationPress = useCallback(
        async (item: NotificationType) => {
            Toast.hide();

            if (isScreenBlurred) return;

            const markNotificationRead = async (item: NotificationType) => {
                if (!item?.hasRead) {
                    markAsRead({variables: {id: Number(item.id)}});
                }
            };

            const handleSurveyNavigation = async (surveyId: string) => {
                try {
                    getHappeningSurvey({
                        variables: {id: surveyId},
                    }).then(({data: surveyItem}) => {
                        if (!surveyItem?.happeningSurveys[0]) {
                            return Toast.error(
                                _('Not found!'),
                                'Survey has been deleted !',
                            );
                        }
                        Toast.hide();
                        navigation.navigate('SurveyItem', {
                            item: surveyItem?.happeningSurveys[0],
                        });
                    });
                } catch (error) {
                    Toast.error(
                        _('Not found!'),
                        'Unable to retrieve survey data.',
                    );
                }
            };

            await markNotificationRead(item);

            if (item?.notificationType.startsWith('happening_survey')) {
                await handleSurveyNavigation(
                    item.actionObjectObjectId.toString(),
                );
            }
        },
        [getHappeningSurvey, markAsRead, navigation, isScreenBlurred],
    );

    const renderItem: ListRenderItem<NotificationType> = useCallback(
        ({item}: {item: NotificationType}) => (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.7}
                disabled={markAsReadStatus}
                style={cs(styles.notificationContainer, [
                    styles.notificationUnread,
                    !item.hasRead,
                ])}>
                <View style={styles.iconContainer}>
                    <Icon
                        name={
                            icons[item.notificationType as keyof IconType] ||
                            icons.default
                        }
                        height={30}
                        width={30}
                        fill={COLORS.white}
                    />
                </View>
                <View style={styles.notificationWrapper}>
                    <Text
                        style={styles.description}
                        title={item?.description}
                    />
                    <Text
                        style={styles.date}
                        title={formatDistanceToNow(new Date(item.createdAt))}
                    />
                </View>
            </TouchableOpacity>
        ),
        [handleNotificationPress],
    );
    return (
        <View style={styles.container}>
            <FlatList
                data={data?.notifications || []}
                keyExtractor={keyExtractor}
                ListEmptyComponent={loading ? null : <NoNotification />}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Notifications;
