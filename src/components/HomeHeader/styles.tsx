import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    header: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        zIndex: 5,
        paddingTop: 45,
        paddingBottom: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    homeHeader: {
        backgroundColor: 'transparent',
    },
    homeScreenTab: {
        marginBottom: 0,
        backgroundColor: COLORS.white,
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    tabStyle: {
        marginBottom: 0,
    },
    activeTabStyle: {
        backgroundColor: '#DCE3E9',
    },
    activeTabTitle: {
        color: COLORS.blueTextAlt,
    },
    rightBar: {
        display: 'flex',
        flexDirection: 'row',
    },
    notificationBar: {
        position: 'relative',
        backgroundColor: '#E7EEF6',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
    },
    exportBar: {
        backgroundColor: '#E7EEF6',
        borderRadius: 20,
        padding: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportIcon: {
        height: 26,
        width: 26,
        resizeMode: 'contain',
    },
    whiteBg: {
        backgroundColor: COLORS.white,
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    rightMargin: {
        marginRight: 8,
    },
    menuBar: {
        backgroundColor: COLORS.blueTextAlt,
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    title: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.white,
    },
    shadowItem: {
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    bottomContent: {
        padding: 2,
        position: 'absolute',
        top: 100,
        right: 0,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
    filterButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButtonTouchable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: COLORS.white,
        borderRadius: 25,
        elevation: 10,
        height: 34,
        width: 34,
    },
    filtersContainer: {
        borderRadius: 8,
        position: 'absolute',
        top: 100,
        right: 90,
        left: 20,
        zIndex: 6,
    },
    notificationCount: {
        position: 'absolute',
        top: 6,
        right: 6,
        color: COLORS.white,
        backgroundColor: COLORS.error,
        height: 12,
        width: 12,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    count: {
        fontSize: 8,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.white,
    }
});
