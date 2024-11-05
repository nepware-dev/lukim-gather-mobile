import React from 'react';
import {View} from 'react-native';

import WebViewer from 'components/WebViewer';
import useLukimInfo from 'hooks/useLukimInfo';

import styles from './styles';

const About = () => {
    const infoData = useLukimInfo('ABOUT');
    return (
        <View style={styles.container}>
            <WebViewer html={infoData.description} />
        </View>
    );
};

export default About;
