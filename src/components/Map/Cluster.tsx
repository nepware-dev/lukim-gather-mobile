import React, {useEffect, useState} from 'react';
import Mapbox from '@rnmapbox/maps';

import surveyCategory from 'services/data/surveyCategory';

import type {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';
import type {HappeningSurveyType} from '@generated/types';

import markerIcon from 'assets/icons/markers.png';

import {mapStyles} from './styles';

interface Props {
    surveyData: HappeningSurveyType[];
    onPolygonPress?: (
        shape: FeatureCollection<Geometry, GeoJsonProperties>,
    ) => void;
    onPointPress?: (
        shape: FeatureCollection<Geometry, GeoJsonProperties>,
    ) => void;
    shapeSourceRef: React.MutableRefObject<Mapbox.ShapeSource>;
}

const createFeatureCollection = (
    survey: HappeningSurveyType,
    type: string,
) => ({
    type: 'Feature',
    id: `"${survey.id}"`,
    properties: {
        surveyItem: survey,
        ...(type === 'boundary' && {title: survey.title}),
    },
    geometry: survey[type],
});

export const Cluster: React.FC<Props> = ({
    surveyData,
    onPolygonPress,
    onPointPress,
    shapeSourceRef,
}) => {
    let icons = surveyCategory
        .map(category =>
            category.childs.map(child => ({[child.id]: child.icon})),
        )
        .flat();
    let categoryIcons = Object.assign({marker: markerIcon}, ...icons);

    const [showPolygonSource, setShowPolygonSource] = useState<boolean>(false);
    const [showPointSource, setShowPointSource] = useState<boolean>(false);

    useEffect(() => {
        const pointSourceExist = surveyData.some(survey => {
            if (survey.location?.coordinates) {
                return true;
            }
        });
        const polygonSourceExist = surveyData.some(survey => {
            if (survey.boundary?.coordinates) {
                return true;
            }
        });
        setShowPointSource(pointSourceExist);
        setShowPolygonSource(polygonSourceExist);
    }, [surveyData, setShowPointSource, setShowPolygonSource]);

    const pointShape =
        surveyData
            .filter((survey: HappeningSurveyType) => survey.location)
            .map((survey: HappeningSurveyType) =>
                createFeatureCollection(survey, 'location'),
            ) || [];
    let surveyGeoJSON = {
        type: 'FeatureCollection',
        features: [...pointShape],
    };

    const polyShape =
        surveyData
            .filter((survey: HappeningSurveyType) => survey.boundary)
            .map((survey: HappeningSurveyType) =>
                createFeatureCollection(survey, 'boundary'),
            ) || [];
    let surveyPolyGeoJSON = {
        type: 'FeatureCollection',
        features: [...polyShape],
    };

    if (!pointShape && !polyShape) {
        return null;
    }

    return (
        <>
            <Mapbox.Images images={categoryIcons} />
            {showPolygonSource && (
                <Mapbox.ShapeSource
                    id="surveyPolygonSource"
                    onPress={onPolygonPress}
                    shape={
                        surveyPolyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <Mapbox.FillLayer id="polygon" style={mapStyles.polygon} />
                    <Mapbox.SymbolLayer
                        id="polyTitle"
                        style={mapStyles.polyTitle}
                    />
                </Mapbox.ShapeSource>
            )}
            {showPointSource && (
                <Mapbox.ShapeSource
                    id="surveyPointsource"
                    ref={shapeSourceRef}
                    cluster
                    onPress={onPointPress}
                    shape={
                        surveyGeoJSON as FeatureCollection<
                            Geometry,
                            GeoJsonProperties
                        >
                    }>
                    <Mapbox.CircleLayer
                        id="circles"
                        style={mapStyles.clusterPoints}
                        filter={['has', 'point_count']}
                    />
                    <Mapbox.SymbolLayer
                        id="pointCount"
                        style={mapStyles.pointCount}
                        filter={['has', 'point_count']}
                    />
                    <Mapbox.SymbolLayer
                        id="iconBackground"
                        style={mapStyles.marker}
                        filter={['!', ['has', 'point_count']]}
                    />
                    <Mapbox.SymbolLayer
                        id="singlePoint"
                        style={mapStyles.singlePoint}
                        filter={['!', ['has', 'point_count']]}
                    />
                </Mapbox.ShapeSource>
            )}
        </>
    );
};
