import React from 'react';
import {Image, Dimensions} from 'react-native';

import styles from './styles';

interface Props {
    imageUrl: string;
    style?: object;
}

const _Image = ({imageUrl, style, ...imageProps}: Props) => {
	return (
                <Image
                    source={{uri: imageUrl}}
                    style={style}
                    {...imageProps}
                />
    );
};

export default _Image;
