import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordOption: {
        flex: 1,
        position: 'relative',
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordOptionIcon: {
        marginHorizontal: 8,
    },
    recordChoice: {
        marginHorizontal: 6,
    },
    recordOptionText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 19,
        color: COLORS.greyTextDark,
        marginRight: 8,
    },
    modal: {
        margin: 0,
        backgroundColor: '#10182870',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: 408,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
    },
    modalResponder: {
        height: 4,
        width: 65,
        backgroundColor: '#C4C4C4',
        alignSelf: 'center',
    },
    record: {
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    startRecordIcon: {
        backgroundColor: '#FDF0E9',
        height: 66,
        width: 66,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.border,
        borderRadius: 33,
    },
    text: {
        color: COLORS.black,
        fontFamily: 'Inter-SemiBold',
        lineHeight: 20,
        fontSize: 16,
        marginTop: 24,
    },
    recordContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 16,
    },
    buttonWrapper: {
        flexDirection: 'row',
        marginTop: 32,
    },
    resetButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
    },
    stopButton: {
        flex: 1,
        backgroundColor: COLORS.error,
        borderColor: COLORS.border,
        marginLeft: 10,
    },
    recordIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 29,
    },
    textStyle: {
        color: COLORS.greyText,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    txtRecordCounter: {
        marginTop: 32,
        color: COLORS.grey200,
        fontSize: 24,
        textAlignVertical: 'center',
        fontWeight: '600',
    },
});
