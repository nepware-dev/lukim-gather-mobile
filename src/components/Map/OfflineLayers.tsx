import React from 'react';
import Mapbox, {ShapeSource} from '@rnmapbox/maps';

import riversSource from 'assets/map/rivers.json';
import oceanSource from 'assets/map/ocean.json';
import lakesSource from 'assets/map/lakes.json';
import countriesSource from 'assets/map/countries.json';
import landSource from 'assets/map/land.json';

import type {GeometryCollection, Geometry} from 'geojson';

const OfflineLayers = () => {
    return (
        <React.Fragment>
            <ShapeSource
                id="lakes-source"
                shape={lakesSource as GeometryCollection<Geometry>}
            />
            <ShapeSource
                id="rivers-source"
                shape={riversSource as GeometryCollection<Geometry>}
            />
            <ShapeSource
                id="boundaries-source"
                shape={countriesSource as GeometryCollection<Geometry>}
            />
            <ShapeSource
                id="ocean-source"
                shape={oceanSource as GeometryCollection<Geometry>}
            />
            <ShapeSource
                id="land-source"
                shape={landSource as GeometryCollection<Geometry>}
            />
        </React.Fragment>
    );
};

export default OfflineLayers;
