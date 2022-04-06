import React, {useCallback, useState, useRef, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNetInfo} from '@react-native-community/netinfo';

import cs from '@rna/utils/cs';

import HomeHeader from 'components/HomeHeader';
import MarkerIcon from 'components/MarkerIcon';

import {MAPBOX_ACCESS_TOKEN} from '@env';
import {checkLocation} from 'utils/location';

import styleJSON from 'assets/map/style.json';

import OfflineLayers from './OfflineLayers';
import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface locationRefType {
    state?: {
        [coordinates: string]: Array<number>;
    };
}

interface Props {
    hideHeader?: boolean;
    showMarker?: boolean;
    locationBarStyle?: object;
}

const mapViewStyles = JSON.stringify(styleJSON);

const Map: React.FC<Props> = ({
    hideHeader = false,
    showMarker = false,
    locationBarStyle,
}) => {
    const netInfo = useNetInfo();

    const [isOffline, setIsOffline] = useState(true);
    useEffect(() => {
        if (netInfo.isInternetReachable) {
            setIsOffline(false);
        }
    }, [netInfo]);

    const locationRef = useRef<locationRefType | null>();

    const [currentLocation, setCurrentLocation] = useState([
        147.17972, -9.44314,
    ]);

    const [mapCameraProps, setMapCameraProps] = useState<object | null>({});

    const handlePress = useCallback(() => {
        checkLocation().then(result => {
            if (result) {
                setMapCameraProps(mcProps => ({
                    zoomLevel: 12,
                    animationMode: 'flyTo',
                    animationDuration: 6000,
                    centerCoordinate: locationRef.current?.state?.coordinates,
                }));
            }
        });
    }, []);

    const onRegionDidChange = useCallback(value => {
        setMapCameraProps({});
    }, []);

    return (
        <View style={styles.page}>
            {!hideHeader && <HomeHeader />}
            <View style={styles.container}>
                <MapboxGL.MapView
                    style={styles.map}
                    onRegionDidChange={onRegionDidChange}
                    styleJSON={isOffline ? mapViewStyles : ''}>
                    <MapboxGL.Camera
                        defaultSettings={{
                            centerCoordinate: currentLocation,
                            zoomLevel: 5,
                        }}
                        {...mapCameraProps}
                    />
                    {isOffline && <OfflineLayers />}
                    <MapboxGL.UserLocation
                        visible={true}
                        showUserLocation={true}
                        ref={locationRef}
                    />
                    {showMarker && (
                        <MapboxGL.PointAnnotation
                            id="marker"
                            coordinate={currentLocation}>
                            <View style={styles.markerContainer}>
                                <MarkerIcon />
                                <View style={styles.markerLine} />
                                <View style={styles.markerDotOuter}>
                                    <View style={styles.markerDotInner} />
                                </View>
                            </View>
                        </MapboxGL.PointAnnotation>
                    )}
                </MapboxGL.MapView>
            </View>
            <View style={cs(styles.locationBar, locationBarStyle)}>
                <TouchableOpacity
                    style={styles.locationWrapper}
                    onPress={handlePress}>
                    <Image
                        source={require('assets/images/locate.png')}
                        style={styles.locationIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Map;
