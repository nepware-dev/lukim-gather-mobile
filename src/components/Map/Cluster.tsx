import React from 'react';
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

export const Cluster: React.FC<Props> = ({
    surveyData,
    onPolygonPress,
    onPointPress,
    shapeSourceRef,
}) => {
    const createFeatureCollection = (
        survey: HappeningSurveyType,
        type: string,
    ) => ({
        type: 'Feature',
        properties: {
            surveyItem: survey,
            ...(type === 'boundary' && {title: survey.title}),
        },
        geometry: survey[type],
    });

    const shape =
        surveyData
            .filter((survey: HappeningSurveyType) => survey.location)
            .map((survey: HappeningSurveyType) =>
                createFeatureCollection(survey, 'location'),
            ) || [];
    let surveyGeoJSON = {
        type: 'FeatureCollection',
        features: [...shape],
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

    let icons = surveyCategory
        .map(category =>
            category.childs.map(child => ({[child.id]: child.icon})),
        )
        .flat();
    let categoryIcons = Object.assign({marker: markerIcon}, ...icons);

    if (!shape) {
        return null;
    }

    return (
        <>
            <Mapbox.Images images={categoryIcons} />
            <Mapbox.ShapeSource
                id="surveyPolySource"
                onPress={onPolygonPress}
                shape={
                    surveyPolyGeoJSON as FeatureCollection<
                        Geometry,
                        GeoJsonProperties
                    >
                }>
                <Mapbox.FillLayer
                    id="polygon"
                    sourceLayerID="surveyPolySource"
                    style={mapStyles.polygon}
                />
                <Mapbox.SymbolLayer
                    id="polyTitle"
                    style={mapStyles.polyTitle}
                />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
                ref={shapeSourceRef}
                id="surveySource"
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
        </>
    );
};
