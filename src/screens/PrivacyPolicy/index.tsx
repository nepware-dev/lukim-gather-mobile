import React from 'react';
import {View} from 'react-native';

import WebViewer from 'components/WebViewer';

import useLukimInfo from 'hooks/useLukimInfo';
import styles from './styles';

const PrivacyPolicy = () => {
    const infoData = useLukimInfo('privacy-policy');
    return (
        <View style={styles.container}>
            <WebViewer html={infoData.description} />
        </View>
    );
};

export default PrivacyPolicy;
