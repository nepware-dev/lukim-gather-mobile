import {StyleSheet, Dimensions, Platform} from 'react-native';

import COLORS from 'utils/colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        borderTopWidth: 10,
        borderTopColor: '#fff',
        height: '100%',
        backgroundColor: '#E7ECF2',
        padding: 20,
    },
    searchWrapper: {
        marginRight: -25,
        marginLeft: Platform.OS === 'ios' ? -30 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 70,
        backgroundColor: '#E7ECF2',
        borderWidth: 1,
        borderColor: COLORS.primaryAlt,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchInput: {
        height: 40,
        width: width - 136,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: COLORS.border,
        padding: 2,
        borderRadius: 8,
        marginBottom: 20,
    },
    tabItem: {
        width: width / 2 - 22,
        alignSelf: 'stretch',
        padding: 8,
        borderRadius: 8,
    },
    activeTabItem: {
        backgroundColor: COLORS.white,
    },
    tabTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
        color: COLORS.tertiary,
        textAlign: 'center',
    },
});
