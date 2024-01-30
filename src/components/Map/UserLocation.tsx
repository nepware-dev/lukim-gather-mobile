import React from 'react';
import {LocationPuck} from '@rnmapbox/maps';

interface UserLocationProps {
    visible: boolean;
}

export const UserLocation = ({visible}: UserLocationProps) => {
    return (
        <LocationPuck
            visible={visible}
	    puckBearing="heading"
	    puckBearingEnabled
        />
    );
};
