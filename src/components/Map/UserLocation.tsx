import React from 'react';
import Mapbox from '@rnmapbox/maps';

interface UserLocationProps {
    visible: boolean;
}

export const UserLocation = ({visible}: UserLocationProps) => {
    return (
        <Mapbox.UserLocation
            visible={visible}
            renderMode="native"
            androidRenderMode="compass"
            showsUserHeadingIndicator
        />
    );
};
