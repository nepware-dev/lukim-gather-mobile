import {StyleSheet} from 'react-native';
import COLORS from 'utils/colors';

export default StyleSheet.create({
    headerIcon: {
        position: 'relative',
        paddingHorizontal: 20,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    notificationCount: {
        position: 'absolute',
        top: 15,
        right: 20,
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
