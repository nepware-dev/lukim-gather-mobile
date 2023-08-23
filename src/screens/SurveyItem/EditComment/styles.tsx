import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    actionModal: {
        justifyContent: 'flex-end',
        margin: 0,
        flexDirection: 'column',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        height: 45,
        marginTop: 0,
        lineHeight: 26,
    },
    icon: {
        marginTop: 30,
        marginRight: 10,
    },
});
