import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    name: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fullName: {
        marginRight: 6,
        flex: 1,
    },
    surName: {
        marginLeft: 6,
        flex: 1,
    },
    infoWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    },
    info: {
        fontSize: 14,
        lineHeight: 20,
        marginRight: 5,
        fontFamily: 'Inter-Regular',
        color: COLORS.greyText,
    },
    infoPressable: {
        fontSize: 14,
        paddingRight: 5,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueText,
    },
    button: {
        marginTop: 20,
    },
    login: {
        marginVertical: 20,
        paddingVertical: 10,
    },
    text: {
        color: COLORS.blueTextAlt,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    tabStyle: {
        marginTop: 20,
    },
});
