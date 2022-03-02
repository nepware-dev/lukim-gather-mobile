import React from 'react';
import {View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {MAPBOX_ACCESS_TOKEN} from '@env';
import styles from './styles';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map} />
            </View>
        </View>
    );
};

export default Map;