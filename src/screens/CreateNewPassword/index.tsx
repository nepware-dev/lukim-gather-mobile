import React, {useState, useCallback} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useMutation} from '@apollo/client';

import {ModalLoader} from 'components/Loader';
import InputField from 'components/InputField';
import Button from 'components/Button';
import {_} from 'services/i18n';
import {PASSWORD_RESET_CHANGE} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import Toast from 'utils/toast';
import {
    PasswordResetChangeMutation,
    PasswordResetChangeMutationVariables,
} from 'generated/types';
import {dispatchLogout} from 'services/dispatch';

import styles from './styles';

const CreateNewPassword = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const username = route?.params?.username;
    const identifier = route?.params?.identifier;

    const [password_reset_change, {loading}] = useMutation<
        PasswordResetChangeMutation,
        PasswordResetChangeMutationVariables
    >(PASSWORD_RESET_CHANGE, {
        onCompleted: () => {
            dispatchLogout();
            navigation.navigate('Auth', {screen: 'Login'});
            Toast.show('Password created successfully!');
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
            console.log(err);
        },
    });

    const handlePasswordResetChange = useCallback(async () => {
        if (password !== rePassword) {
            return Toast.error(_('Passwords do not match!'));
        }
        await password_reset_change({
            variables: {
                data: {
                    username,
                    password,
                    rePassword,
                    identifier,
                },
            },
        });
    }, [password_reset_change, username, password, rePassword, identifier]);
    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <ModalLoader loading={loading} />
            <InputField
                value={password}
                onChangeText={setPassword}
                title={_('New password')}
                placeholder={_('Enter new password')}
                password
            />
            <InputField
                value={rePassword}
                onChangeText={setRePassword}
                title={_('Confirm new password')}
                placeholder={_('Re-enter password')}
                password
            />
            <Button
                title={_('Reset Password')}
                style={styles.button}
                onPress={handlePasswordResetChange}
                disabled={!password || !rePassword}
            />
        </KeyboardAwareScrollView>
    );
};

export default CreateNewPassword;
