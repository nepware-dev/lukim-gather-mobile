import {StyleSheet, Dimensions} from 'react-native';

import COLORS from 'utils/colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F3F7',
        paddingVertical: 25,
    },
    images: {
        borderRadius: 8,
        height: 110,
        width: 150,
        resizeMode: 'cover',
        marginRight: 16,
        backgroundColor: '#F0F3F7',
    },
    imageContainer: {
        position: 'relative',
    },
    imageFooterContainer: {
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTextContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -16,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        textAlign: 'center',
        width: '65%',
        fontSize: 10,
        color: COLORS.primaryLight,
    },
    image: {
        flex: 1,
        width: width,
        resizeMode: 'contain',
    },
    closeIcon: {
        alignSelf: 'flex-start',
        left: 10,
        top: 10,
        zIndex: 1,
    },
    text: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    imageFooterText: {
        color: COLORS.greyTextDark,
        fontSize: 17,
        fontFamily: 'Inter-Regular',
        fontWeight: '600',
    },
});
