import React, {useEffect, useCallback, useState, useRef} from 'react';
import {View, Image, Platform, PermissionsAndroid} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {RootStateOrAny, useSelector} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

import Text from 'components/Text';
import {OptionIcon} from 'components/HeaderButton';
import SurveyActions from 'components/SurveyActions';
import ExportActions from 'components/ExportActions';
import SurveyReview from 'components/SurveyReview';

import useCategoryIcon from 'hooks/useCategoryIcon';
import {_} from 'services/i18n';
import SurveyCategory from 'services/data/surveyCategory';
import {
    DELETE_HAPPENING_SURVEY,
    GET_HAPPENING_SURVEY,
} from 'services/gql/queries';

import type {
    HappeningSurveyType,
    DeleteHappeningSurveyMutation,
    DeleteHappeningSurveyMutationVariables,
} from '@generated/types';

import {getErrorMessage} from 'utils/error';

import styles from './styles';

const Header = ({title}: {title: string}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle} title={title} />
        </View>
    );
};

const Photos = ({photos}: {photos: {media: string}[]}) => {
    const renderItem = useCallback(
        ({item}: {item: {media: string}}) => (
            <Image
                source={
                    {uri: item.media} ||
                    require('assets/images/category-placeholder.png')
                }
                style={styles.surveyImage}
            />
        ),
        [],
    );
    return (
        <FlatList
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const SurveyItem = () => {
    const viewShotRef = useRef<any>();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const [isOpenActions, setIsOpenActions] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const [isOpenExport, setIsOpenExport] = useState(false);

    const surveyData = route?.params?.item;
    const [categoryIcon] = useCategoryIcon(
        SurveyCategory,
        Number(surveyData?.category?.id),
    );

    const {user} = useSelector((state: RootStateOrAny) => state.auth);

    const [deleteHappeningSurvey] = useMutation<
        DeleteHappeningSurveyMutation,
        DeleteHappeningSurveyMutationVariables
    >(DELETE_HAPPENING_SURVEY, {
        onCompleted: () => {
            Toast.show('Happening survey deleted successfully !');
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log('Delete happening survey', err);
        },
    });

    const toggleOpenActions = useCallback(() => {
        setIsOpenActions(!isOpenActions);
        setIsOpenDelete(false);
    }, [isOpenActions]);

    const toggleEditPress = useCallback(() => {
        setIsOpenActions(false);
        navigation.navigate('EditSurvey', {surveyItem: surveyData});
    }, [navigation, surveyData]);

    const toggleDeleteModal = useCallback(() => {
        setIsOpenDelete(true);
    }, []);

    const toggleActionsModal = useCallback(() => {
        setIsOpenActions(false);
    }, []);

    const toggleExportModal = useCallback(() => {
        setIsOpenExport(!isOpenExport);
    }, [isOpenExport]);

    const toggleConfirmDelete = useCallback(async () => {
        setIsOpenActions(false);
        await deleteHappeningSurvey({
            variables: {
                id: surveyData.id,
            },
            optimisticResponse: {
                deleteHappeningSurvey: {
                    __typename: 'DeleteHappeningSurvey',
                    ok: true,
                    errors: null,
                },
            },
            update: cache => {
                try {
                    const readData: any =
                        cache.readQuery({
                            query: GET_HAPPENING_SURVEY,
                        }) || [];
                    let happeningSurveys = readData?.happeningSurveys.filter(
                        (obj: HappeningSurveyType) => {
                            return obj.id !== surveyData.id;
                        },
                    );
                    cache.writeQuery({
                        query: GET_HAPPENING_SURVEY,
                        data: {
                            happeningSurveys: happeningSurveys,
                        },
                    });
                    navigation.navigate('Feed');
                } catch (e) {
                    console.log('Error on deleting happening survey !!!', e);
                }
            },
        });
    }, [deleteHappeningSurvey, navigation, surveyData?.id]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                surveyData.createdBy?.id === user?.id ? (
                    <OptionIcon onOptionPress={toggleExportModal} />
                ) : null,
        });
    }, [navigation, toggleExportModal, surveyData, user]);

    const getPermissionAndroid = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Image export permission',
                    message: 'Your permission is required to save image',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            console.log('Permission required');
        } catch (err) {
            console.log('Error' + err);
        }
    }, []);

    const onClickExportImage = useCallback(async () => {
        try {
            await viewShotRef.current.capture().then((uri: any) => {
                console.log(uri);
                if (Platform.OS === 'android') {
                    const granted = getPermissionAndroid();
                    if (!granted) {
                        return;
                    }
                }
                CameraRoll.save(uri, {
                    type: 'photo',
                    album: 'Lukim Gather',
                });
                Toast.show(_('Saved image in gallery!'));
                return setIsOpenExport(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, [getPermissionAndroid]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <ViewShot ref={viewShotRef} style={styles.container}>
                <View style={styles.category}>
                    <Image
                        source={
                            categoryIcon ||
                            require('assets/images/category-placeholder.png')
                        }
                        style={styles.categoryIcon}
                    />
                    <Text
                        style={styles.field}
                        title={_(surveyData?.category?.title)}
                    />
                </View>
                <Header title={_('Name')} />
                <View style={styles.content}>
                    <Text style={styles.name} title={surveyData?.title} />
                </View>
                <Header title={_('Photos')} />
                <View style={styles.photosWrapper}>
                    <Photos photos={surveyData?.attachment} />
                </View>
                {surveyData?.sentiment.length > 0 && (
                    <>
                        <Header title={_('Feels')} />
                        <View style={styles.content}>
                            <View style={styles.feeelWrapper}>
                                <Text
                                    style={styles.feelIcon}
                                    title={surveyData?.sentiment}
                                />
                            </View>
                        </View>
                    </>
                )}
                {surveyData?.improvement && (
                    <>
                        <Header title={_('Improvement')} />
                        <View style={styles.content}>
                            <SurveyReview
                                name={surveyData.improvement}
                                reviewItem={true}
                            />
                        </View>
                    </>
                )}
                <Header title={_('Description')} />
                <View style={styles.content}>
                    <Text
                        style={styles.description}
                        title={surveyData?.description}
                    />
                </View>
                <SurveyActions
                    isOpenActions={isOpenActions}
                    onEditPress={toggleEditPress}
                    onDeletePress={toggleDeleteModal}
                    onBackdropPress={toggleActionsModal}
                    isConfirmDeleteOpen={isOpenDelete}
                    toggleCancelDelete={toggleActionsModal}
                    toggleConfirmDelete={toggleConfirmDelete}
                />
                <ExportActions
                    isOpenExport={isOpenExport}
                    onBackdropPress={toggleExportModal}
                    onClickExportImage={onClickExportImage}
                />
            </ViewShot>
        </ScrollView>
    );
};

export default SurveyItem;
