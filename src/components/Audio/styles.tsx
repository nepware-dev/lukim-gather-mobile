import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    audioWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E7EEF6',
        borderWidth: 1,
        borderColor: '#CEDCEC',
        borderRadius: 48,
        padding: 11,
    },
    audioIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    audioTitle: {
        flex: 1,
        color: COLORS.greyText,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        fontWeight: '500',
        marginHorizontal: 11,
    },
    riplerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    riplerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    riplerIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(236, 109, 37, 0.4)',
        height: 60,
        width: 60,
        borderRadius: 120,
    },
    ripler: {
        position: 'absolute',
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: COLORS.secondary,
        opacity: 0.2,
        zIndex: 2,
    },
});
