import React, {useCallback, useState} from 'react';
import {Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';

import Text from 'components/Text';
import Filters, {type FiltersProps} from 'components/Filters';
import SurveyListTab from 'components/SurveyListTab';

import cs from '@rna/utils/cs';
import {_} from 'services/i18n';
import { GET_NOTIFICATIONS_UNREAD_COUNT } from 'services/gql/queries';

import COLORS from 'utils/colors';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';
import type {HomeNavParamList} from 'navigation/tab';

import styles from './styles';

interface Props {
    selectedTab?: string;
    setSelectedTab(selectedTab: string): void;
    homeScreen?: boolean;
    onExportPress?(): void;
    projectFilterId: FiltersProps['activeProjectId'];
    categoryFilterId: FiltersProps['activeCategoryId'];
    setProjectFilterId: FiltersProps['onProjectChange'];
    setCategoryFilterId: FiltersProps['onCategoryChange'];
    onToggleFilters?: (isVisible: boolean) => void;
}

const HomeHeader: React.FC<Props> = props => {
    const {
        selectedTab = 'all',
        setSelectedTab,
        homeScreen,
        onExportPress,
        projectFilterId,
        setProjectFilterId,
        categoryFilterId,
        setCategoryFilterId,
        onToggleFilters,
    } = props;

    const navigation =
        useNavigation<StackNavigationProp<StackParamList & HomeNavParamList>>();
    const onSearchPress = useCallback(
        () => navigation.navigate('SearchSurvey'),
        [navigation],
    );
    const onListPress = useCallback(
        () =>
            navigation.navigate('Surveys', {
                filters: {projectFilterId, categoryFilterId},
            }),
        [navigation, projectFilterId, categoryFilterId],
    );
    const onMapPress = useCallback(
        () =>
            navigation.navigate('HomeScreen', {
                filters: {projectFilterId, categoryFilterId},
            }),
        [navigation, projectFilterId, categoryFilterId],
    );

    const [isFilterActive, setFilterActive] = useState<boolean>(
        Boolean(projectFilterId || categoryFilterId),
    );
    const toggleFilterActive = useCallback(() => {
        setFilterActive(!isFilterActive);
        onToggleFilters?.(!isFilterActive);
    }, [onToggleFilters, isFilterActive]);

    const handleClearFilters = useCallback(() => {
        setFilterActive(false);
        setProjectFilterId(null);
        setCategoryFilterId(null);
    }, [setProjectFilterId, setCategoryFilterId]);

    const [getUnreadCount] = useLazyQuery(GET_NOTIFICATIONS_UNREAD_COUNT, {
        fetchPolicy: 'network-only',
    });
    const [unRead, setUnRead] = useState<boolean>(false);

    const handleRefresh = useCallback(() => {
        getUnreadCount().then(({data}) =>
            setUnRead(data?.notificationUnreadCount > 0),
        );
    }, [getUnreadCount]);

    useFocusEffect(handleRefresh);

    const handleNotificationPress= useCallback(() => {
        navigation.navigate('Notifications', {});
    }, [])

    return (
        <>
            <View style={cs(styles.header, [styles.homeHeader, homeScreen])}>
                <TouchableOpacity
                    onPress={homeScreen ? onListPress : onMapPress}
                    style={cs(styles.menuBar, homeScreen && styles.shadowItem)}>
                    <Icon
                        name={homeScreen ? 'list-outline' : 'map'}
                        height={22}
                        width={22}
                        fill={'#fff'}
                    />
                    <Text
                        style={styles.title}
                        title={homeScreen ? _('List') : _('Map')}
                    />
                </TouchableOpacity>
                <SurveyListTab
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    tabStyle={
                        homeScreen ? styles.homeScreenTab : styles.tabStyle
                    }
                    activeTabStyle={cs(homeScreen && styles.activeTabStyle)}
                    activeTabTitle={styles.activeTabTitle}
                    isHomeTab={true}
                />
                <View style={styles.rightBar}>
                    <TouchableOpacity
                        onPress={handleNotificationPress}
                        style={cs(styles.notificationBar, styles.rightMargin, [styles.whiteBg, homeScreen])}>
                        {unRead ? (
                            <Image
                                style={styles.notificationIcon}
                                source={require('assets/images/active-notification.png')}
                            />
                        ) : (
                            <Icon
                                name="bell-outline"
                                height={20}
                                width={20}
                                fill={COLORS.grey200}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onExportPress}
                        style={cs(
                            styles.exportBar,
                            [styles.whiteBg, homeScreen],
                            {
                                display: 'flex', //todo
                            },
                        )}>
                        <Image
                            source={require('assets/images/export.png')}
                            style={styles.exportIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContent}>
                <View
                    style={styles.filterButton}>
                    {(isFilterActive || projectFilterId || categoryFilterId) ? (
                        <TouchableOpacity
                            style={cs(styles.filterButtonTouchable, styles.whiteBg)}
                            onPress={handleClearFilters}>
                            <Icon
                                name="close-outline"
                                width={25}
                                height={25}
                                fill={COLORS.accent}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={cs(styles.filterButtonTouchable, styles.whiteBg)}
                            onPress={toggleFilterActive}>
                            <Icon
                                name="funnel"
                                width={18}
                                height={18}
                                fill={COLORS.grey200}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    onPress={onSearchPress}
                    style={cs(styles.searchBar, styles.rightMargin, styles.whiteBg)}>
                    <Icon
                        name="search-outline"
                        height={22}
                        width={22}
                        fill={'#101828'}
                    />
                </TouchableOpacity>
            </View>
            {isFilterActive && (
                <View
                    style={cs(styles.filtersContainer)}>
                    <Filters
                        activeProjectId={projectFilterId}
                        onProjectChange={setProjectFilterId}
                        activeCategoryId={categoryFilterId}
                        onCategoryChange={setCategoryFilterId}
                    />
                </View>
            )}
        </>
    );
};

export default HomeHeader;
