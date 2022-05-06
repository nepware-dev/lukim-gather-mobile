import React, {useState, useCallback} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';

import {ModalLoader} from 'components/Loader';
import InputField from 'components/InputField';
import Button from 'components/Button';

import {Localize} from '@rna/components/I18n';

import {_} from 'services/i18n';
import {PASSWORD_RESET} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import {
    PasswordResetMutation,
    PasswordResetMutationVariables,
} from 'generated/types';

import styles from './styles';

const ForgotPassword = () => {
    const navigation = useNavigation<any>();

    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [email, setEmail] = useState<string>('');
    const [password_reset, {loading}] = useMutation<
        PasswordResetMutation,
        PasswordResetMutationVariables
    >(PASSWORD_RESET, {
        onCompleted: () => {
            navigation.navigate('VerifyEmail', {email});
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            console.log(err);
        },
    });

    const handlePasswordReset = useCallback(async () => {
        await password_reset({
            variables: {
                data: {
                    username: email.toLowerCase(),
                },
            },
        });
    }, [password_reset, email]);

    const handleNoAccountPress = React.useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <Text style={styles.title}>
                <Localize>
                    Enter the email address or phone number associated with your
                    account
                </Localize>
            </Text>
            <InputField
                value={email}
                onChangeText={setEmail}
                title={_('Email or Phone')}
                placeholder="johndoe@example.com"
            />
            <Button
                title={_('Send Code')}
                style={styles.button}
                onPress={handlePasswordReset}
                disabled={!email}
            />
            {!isAuthenticated && (
                <TouchableOpacity
                    style={styles.link}
                    onPress={handleNoAccountPress}>
                    <Text style={styles.text}>
                        <Localize>Don't have an account?</Localize>
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ForgotPassword;
