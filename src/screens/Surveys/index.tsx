import React, {useRef, useCallback, useState, useMemo, useEffect} from 'react';
import {
    RefreshControl,
    View,
    ListRenderItem,
    FlatList,
    PermissionsAndroid,
    Platform,
    Linking,
} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'react-native-blob-util';
import {format} from 'date-fns';
import { useLazyQuery } from '@apollo/client';

import SurveyItem from 'components/SurveyItem';
import EmptyListMessage from 'components/EmptyListMessage';
import ExportActions from 'components/ExportActions';
import HomeHeader from 'components/HomeHeader';

import cs from '@rna/utils/cs';
import {jsonToCSV} from 'utils';
import sentimentName from 'utils/sentimentName';
import Toast from 'utils/toast';
import {_} from 'services/i18n';
import {GET_HAPPENING_SURVEY} from 'services/gql/queries';
import type {LocalCategoryType} from 'services/data/surveyCategory';

import {HappeningSurveyType} from '@generated/types';
import type {ProjectType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: HappeningSurveyType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id.toString();

const Surveys = () => {
    const viewShotRef = useRef<any>();
    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const route = useRoute<any>();

    const [data, setData] = useState<HappeningSurveyType>();
    const [loading, setLoading] = useState(true);

    const [getAllSurvey] = useLazyQuery(GET_HAPPENING_SURVEY, {
        variables: {
            ordering: '-modified_at',
        },
    });

    const [selectedTab, setSelectedTab] = useState('all');
    const [isOpenExport, setIsOpenExport] = useState(false);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

    const handleCloseExportModal = useCallback(() => {
        setIsOpenExport(false);
    }, [])

    const handleRefresh = useCallback(() => {
        getAllSurvey().then(({data}) => {
            setData(data?.happeningSurveys);
            setLoading(false);
        })
    }, []);

    useFocusEffect(handleRefresh);

    const [categoryFilterId, setCategoryFilterId] = useState<
        null | LocalCategoryType['id']
    >(route?.params?.filters?.categoryFilterId || null);
    const [projectFilterId, setProjectFilterId] = useState<
        null | ProjectType['id']
    >(route?.params?.filters?.projectFilterId || null);

    useEffect(() => {
        if (route?.params?.filters?.categoryFilterId !== undefined) {
            setCategoryFilterId(route.params.filters.categoryFilterId);
        }
        if (route?.params?.filters?.projectFilterId !== undefined) {
            setProjectFilterId(route.params.filters.projectFilterId);
        }
    }, [route?.params?.filters]);

    const [filtersShown, setFiltersShown] = useState<boolean>(
        Boolean(categoryFilterId || projectFilterId),
    );

    const selectedData = useMemo(() => {
        const filteredData = (data || []).filter(
            (el: HappeningSurveyType) => {
                if (categoryFilterId && projectFilterId) {
                    return (
                        el?.category?.id &&
                        Number(el.category.id) === Number(categoryFilterId) &&
                        el?.project?.id &&
                        el.project.id === projectFilterId
                    );
                }
                if (categoryFilterId) {
                    return (
                        el?.category?.id &&
                        Number(el.category.id) === Number(categoryFilterId)
                    );
                }
                if (projectFilterId) {
                    return el?.project?.id && el.project.id === projectFilterId;
                }
                return true;
            },
        );

        return selectedTab === 'myentries'
            ? filteredData.filter(
                  (el: HappeningSurveyType) =>
                      el.createdBy?.id && el.createdBy?.id === user?.id,
              )
            : filteredData;
    }, [
        data,
        selectedTab,
        user?.id,
        categoryFilterId,
        projectFilterId,
    ]);

    const renderItem: ListRenderItem<HappeningSurveyType> = useCallback(
        ({item}: {item: HappeningSurveyType}) => <SurveyItem item={item} />,
        [],
    );

    const getPermissionAndroid = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: _('Image export permission'),
                    message: _('Your permission is required to save image'),
                    buttonNegative: _('Cancel'),
                    buttonPositive: _('OK'),
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            Toast.error(_('Permission required'));
        } catch (err) {
            console.log('Error' + err);
        }
    }, []);

    const onClickExportImage = useCallback(async () => {
        try {
            await viewShotRef.current.capture().then(async (uri: any) => {
                console.log(uri);
                if (Platform.OS === 'android') {
                    const granted = getPermissionAndroid();
                    if (!granted) {
                        return;
                    }
                }
                const newURI = await CameraRoll.save(uri, {
                    type: 'photo',
                    album: 'Lukim Gather',
                });
                Toast.show(_('Saved image in gallery!'));
                Linking.openURL(newURI);
                return setIsOpenExport(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, [getPermissionAndroid]);

    const onClickExportCSV = useCallback(async () => {
        const dt = selectedData.map((item: any) => ({
            ...item,
            sentiment: sentimentName[item.sentiment],
            location: item.location?.coordinates
                ? `[${item.location.coordinates.toString?.() || ''}]`
                : '',
            boundary: item.boundary?.coordinates
                ? `[${item.boundary.coordinates.toString?.() || ''}]`
                : '',
            createdAt: item.createdAt
                ? format(new Date(item.createdAt), 'MMM dd, yyyy')
                : '',
            modifiedAt: item.modifiedAt
                ? format(new Date(item.modifiedAt), 'MMM dd, yyyy')
                : '',
            attachment: item.attachment
                ?.map((a: {media: string}) => a.media)
                .join(', '),
        }));
        const config = [
            {title: 'ID', dataKey: 'id'},
            {title: _('Title'), dataKey: 'title'},
            {title: _('Description'), dataKey: 'description'},
            {title: _('Category'), dataKey: 'category.title'},
            {title: _('Project'), dataKey: 'project.title'},
            {title: _('Location'), dataKey: 'location'},
            {title: _('Boundary'), dataKey: 'boundary'},
            {title: _('Sentiment'), dataKey: 'sentiment'},
            {title: _('Improvement'), dataKey: 'improvement'},
            {title: _('Created At'), dataKey: 'createdAt'},
            {title: _('Modified At'), dataKey: 'modifiedAt'},
            {title: _('Audio'), dataKey: 'audioFile'},
            {title: _('Photos'), dataKey: 'attachment'},
        ];
        const csv = jsonToCSV(dt, config);
        const fileName = `surveys_${Date.now()}.csv`;
        const path = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
        RNFetchBlob.fs.writeFile(path, csv, 'utf8').then(() => {
            if (Platform.OS === 'android') {
                RNFetchBlob.android.addCompleteDownload({
                    title: fileName,
                    description: 'Download complete!',
                    mime: 'text/csv',
                    path: path,
                    showNotification: true,
                });
            } else if (Platform.OS === 'ios') {
                RNFetchBlob.ios.previewDocument(path);
            }
        });
        Toast.show(_('Saved CSV in Downloads folder!'));
        setIsOpenExport(false);
    }, [selectedData]);

    const handleFiltersToggle = useCallback(setFiltersShown, [setFiltersShown]);

    return (
        <View
            style={cs(styles.container, [
                styles.containerShifted,
                filtersShown,
            ])}>
            <HomeHeader
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                onExportPress={toggleExportModal}
                projectFilterId={projectFilterId}
                setProjectFilterId={setProjectFilterId}
                categoryFilterId={categoryFilterId}
                // @ts-expect-error Unable to cast to type expected by dropdown component
                setCategoryFilterId={setCategoryFilterId}
                onToggleFilters={handleFiltersToggle}
            />
            <ViewShot ref={viewShotRef}>
                <FlatList
                    data={selectedData || []}
                    style={styles.surveyList}
                    contentContainerStyle={styles.surveyListContentContainer}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={handleRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={loading ? null : EmptyListMessage}
                />
            </ViewShot>
            <ExportActions
                isOpenExport={isOpenExport}
                onBackdropPress={handleCloseExportModal}
                onClickExportImage={onClickExportImage}
                onClickExportCSV={onClickExportCSV}
            />
        </View>
    );
};

export default Surveys;
