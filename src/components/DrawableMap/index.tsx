import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Image, Alert} from 'react-native';
import {Icon} from 'react-native-eva-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Mapbox, {
    MapView,
    Camera,
    FillLayer,
    SymbolLayer,
    CircleLayer,
    ShapeSource,
    PointAnnotation,
    offlineManager,
    Images,
} from '@rnmapbox/maps';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';

import cs from '@rna/utils/cs';
import surveyCategory from 'services/data/surveyCategory';
import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';
import COLORS from 'utils/colors';

import {HappeningSurveyType} from '@generated/types';
import type {
    Feature,
    FeatureCollection,
    Geometry,
    GeoJsonProperties,
} from 'geojson';

import styleJSON from 'assets/map/style.json';

import {UserLocation} from '../Map/UserLocation';
import OfflineLayers from '../Map/OfflineLayers';
import DrawPolygonIcon from '../Map/Icon/DrawPolygon';
import MarkerIcon from '../Map/Icon/Marker';
import styles, {mapStyles} from './styles';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface Props {
    showCluster?: boolean;
    showMarker?: boolean;
    locationBarStyle?: object;
    onLocationPick?: (location: number[] | number[][] | undefined) => void;
    pickLocation?: string;
    surveyData?: HappeningSurveyType[];
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    showCluster = false,
    showMarker = false,
    onLocationPick,
    locationBarStyle,
    pickLocation = null,
    surveyData = [],
}) => {
    const netInfo = useNetInfo();

    const [isOffline, setIsOffline] = useState(true);

    const manageOffline = useCallback(
        async packName => {
            try {
                const offlinePack = await offlineManager.getPack(
                    packName,
                );
                if (!offlinePack) {
                    if (netInfo.isInternetReachable) {
                        setIsOffline(false);
                        return offlineManager.createPack({
                            name: packName,
                            styleURL: 'mapbox://styles/mapbox/streets-v11',
                            minZoom: 0,
                            maxZoom: 10,
                            bounds: [
                                [156.4715, -1.5917],
                                [140.7927, -12.1031],
                            ],
                        });
                    }
                } else {
                    setIsOffline(false);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [netInfo],
    );

    const mapRef = useRef() as React.MutableRefObject<MapView>;
    const mapCameraRef = useRef() as React.MutableRefObject<Camera>;
    const shapeSourceRef =
        useRef() as React.MutableRefObject<ShapeSource>;
    const [currentLocation, setCurrentLocation] = useState<
        number[] | undefined
    >([147.17972, -9.44314]);

    const [drawPolygon, setDrawPolygon] = useState<boolean>(false);
    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});
    const [polygonPoint, setPolygonPoint] = useState<number[][]>([]);

    const handleLocationPress = useCallback(() => {
        if (
            surveyData?.length === 1 &&
            (surveyData[0].location || surveyData[0].boundary)
        ) {
            let coordinates = [];
            if (surveyData[0].location) {
                coordinates = surveyData[0].location.coordinates;
            } else if (surveyData[0].boundary) {
                coordinates = surveyData[0].boundary.coordinates?.[0]?.[0]?.[0];
            }
            if (coordinates?.length) {
                mapCameraRef.current.setCamera({
                    zoomLevel: 13,
                    animationDuration: 3000,
                    centerCoordinate: coordinates,
                });
            }
            return;
        }
        checkLocation().then(result => {
            if (result) {
                Geolocation.getCurrentPosition(
                    position => {
                        const coordinates = [
                            position.coords.longitude,
                            position.coords.latitude,
                        ];
                        mapCameraRef.current.setCamera({
                            zoomLevel: 13,
                            animationDuration: 3000,
                            centerCoordinate: coordinates,
                        });
                        setCurrentLocation(coordinates);
                    },
                    error => {
                        Alert.alert(`Code ${error.code}`, error.message);
                    },
                    {enableHighAccuracy: true, timeout: 15000},
                );
            }
        });
    }, [surveyData]);

    const handleFinishMapLoad = useCallback(() => {
        manageOffline('png_14_20');
        handleLocationPress();
    }, [manageOffline, handleLocationPress]);

    useEffect(() => {
        if (netInfo.isInternetReachable) {
            setIsOffline(false);
        }
    }, [netInfo.isInternetReachable]);

    useEffect(() => {
        switch (pickLocation) {
            case 'Use my current location':
                setDrawPolygon(false);
                setPolygonPoint([]);
                Geolocation.getCurrentPosition(position => {
                    const coordinates = [
                        position.coords.longitude,
                        position.coords.latitude,
                    ];
                    onLocationPick && onLocationPick?.(coordinates);
                });
                break;
            case 'Set on a map':
                setDrawPolygon(false);
                setPolygonPoint([]);
                break;
            case 'Draw polygon':
                break;
            default:
                setDrawPolygon(false);
                setPolygonPoint([]);
        }
    }, [pickLocation, onLocationPick]);

    const onRegionDidChange = useCallback(() => {
        setMapCameraProps({});
    }, []);

    const renderAnnotation = useCallback(() => {
        return (
            <PointAnnotation
                id="marker"
                coordinate={currentLocation as number[]}
                anchor={{x: 0.5, y: 0.9}}>
                <View style={styles.markerContainer}>
                    <MarkerIcon />
                    <View style={styles.markerLine} />
                    <View style={styles.markerDotOuter}>
                        <View style={styles.markerDotInner} />
                    </View>
                </View>
            </PointAnnotation>
        );
    }, [currentLocation]);

    const renderPolygon = useCallback(() => {
        const polygonGeoJSON = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [...polygonPoint],
            },
        };

        if (polygonPoint.length > 0) {
            return (
                <ShapeSource
                    id="polygonSource"
                    shape={
                        polygonGeoJSON as Feature<Geometry, GeoJsonProperties>
                    }>
                    <FillLayer
                        id="polygonFill"
                        style={mapStyles.polygonFill}
                    />
                    {polygonPoint.map((_, index) => (
                        <CircleLayer
                            key={index}
                            id={'point-' + index}
                            style={mapStyles.pointCircle}
                        />
                    ))}
                </ShapeSource>
            );
        }
    }, [polygonPoint]);

    const renderCluster = useCallback(() => {
        const shape =
            surveyData
                .filter((survey: HappeningSurveyType) => survey.location)
                .map((survey: HappeningSurveyType) => ({
                    type: 'Feature',
                    properties: {
                        surveyItem: survey,
                    },
                    geometry: {
                        type: survey.location?.type,
                        coordinates: survey.location?.coordinates,
                    },
                })) || [];

        let surveyGeoJSON = {
            type: 'FeatureCollection',
            features: [...shape],
        };
        const polyShape =
            surveyData
                .filter((survey: HappeningSurveyType) => survey.boundary)
                .map((survey: HappeningSurveyType) => ({
                    type: 'Feature',
                    properties: {
                        surveyItem: survey,
                        title: survey.title,
                    },
                    geometry: survey.boundary,
                })) || [];

        let surveyPolyGeoJSON = {
            type: 'FeatureCollection',
            features: [...polyShape],
        };

        let icons = surveyCategory
            .map(category =>
                category.childs.map(child => ({[child.id]: child.icon})),
            )
            .flat();
        let categoryIcons = Object.assign({}, ...icons);

        if (!shape) {
            return;
        }

        return (
            <>
                <Images images={categoryIcons} />
                <ShapeSource
                    id="surveyPolySource"
                    shape={
                        surveyPolyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <SymbolLayer
                        id="polyTitle"
                        style={mapStyles.polyTitle}
                        belowLayerID="singlePoint"
                        filter={['all', showCluster]}
                    />
                    <FillLayer
                        id="polygon"
                        sourceLayerID="surveyPolySource"
                        belowLayerID="polyTitle"
                        style={mapStyles.polygon}
                        filter={['all', showCluster]}
                    />
                </ShapeSource>
                <ShapeSource
                    ref={shapeSourceRef}
                    id="surveySource"
                    cluster
                    shape={
                        surveyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <SymbolLayer
                        id="pointCount"
                        style={mapStyles.pointCount}
                        filter={['all', ['has', 'point_count'], showCluster]}
                    />
                    <CircleLayer
                        id="circles"
                        style={mapStyles.clusterPoints}
                        filter={['all', ['has', 'point_count'], showCluster]}
                        belowLayerID="pointCount"
                    />
                    <SymbolLayer
                        id="singlePoint"
                        style={mapStyles.singlePoint}
                        filter={[
                            'all',
                            ['!', ['has', 'point_count']],
                            showCluster,
                        ]}
                        belowLayerID="circles"
                    />
                    <SymbolLayer
                        id="iconBackground"
                        style={mapStyles.marker}
                        filter={[
                            'all',
                            ['!', ['has', 'point_count']],
                            showCluster,
                        ]}
                        belowLayerID="singlePoint"
                    />
                </ShapeSource>
            </>
        );
    }, [surveyData, showCluster]);

    const handleRemovePolygon = useCallback(() => {
        setPolygonPoint([]);
    }, []);

    const handleMapPress = useCallback(
        mapEvent => {
            switch (pickLocation) {
                case 'Set on a map':
                    setCurrentLocation(mapEvent.geometry.coordinates);
                    onLocationPick?.(mapEvent.geometry.coordinates);
                    break;
                case 'Draw polygon':
                    setPolygonPoint([
                        ...polygonPoint,
                        mapEvent.geometry.coordinates,
                    ]);
                    onLocationPick &&
                        onLocationPick?.([
                            ...polygonPoint,
                            mapEvent.geometry.coordinates,
                        ]);
                    break;
                default:
                    break;
            }
        },
        [polygonPoint, pickLocation, onLocationPick],
    );

    const handleDrawTool = useCallback(() => {
        setDrawPolygon(!drawPolygon);
    }, [drawPolygon]);

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    onRegionDidChange={onRegionDidChange}
                    onDidFinishLoadingStyle={handleFinishMapLoad}
                    styleJSON={isOffline ? mapViewStyles : ''}
                    compassViewMargins={{x: 30, y: 150}}
                    onPress={handleMapPress}>
                    <Camera
                        defaultSettings={{
                            centerCoordinate: currentLocation,
                            zoomLevel: 5,
                        }}
                        ref={mapCameraRef}
                        {...mapCameraProps}
                    />
                    {isOffline && <OfflineLayers />}
                    {renderCluster()}
                    {showMarker && renderAnnotation()}
                    {pickLocation === 'Draw polygon' && renderPolygon()}
                    <UserLocation visible={true} />
                </MapView>
            </View>
            <View style={cs(styles.locationBar, locationBarStyle)}>
                <TouchableOpacity
                    style={styles.locationWrapper}
                    onPress={handleLocationPress}>
                    <Image
                        source={require('assets/images/locate.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            {pickLocation === 'Draw polygon' && (
                <View style={cs(styles.drawPolygon, locationBarStyle)}>
                    <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={handleDrawTool}>
                        <DrawPolygonIcon active={drawPolygon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={handleRemovePolygon}>
                        <Icon
                            name="trash-2-outline"
                            fill={COLORS.blueText}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Map;
