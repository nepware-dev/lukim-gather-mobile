import React from 'react';
import {Pressable, View} from 'react-native';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';
import Modal from 'components/Modal';
import {_} from 'services/i18n';

import styles from './styles';

const ActionItem = ({onPress, title}: {onPress?(): void; title: string}) => {
    return (
        <Pressable style={styles.option} onPress={onPress}>
            <Icon
                name="edit-2-outline"
                height={25}
                width={25}
                fill={'#888C94'}
            />
            <Text style={styles.title} title={title} />
        </Pressable>
    );
};

interface Props {
    isOpenExport: boolean;
    onBackdropPress(): void;
    onClickExportImage(): void;
}
const ExportActions: React.FC<Props> = ({
    isOpenExport,
    onBackdropPress,
    onClickExportImage,
}) => {
    return (
        <Modal
            isVisible={isOpenExport}
            onBackdropPress={onBackdropPress}
            style={styles.actionModal}>
            <View style={styles.options}>
                <ActionItem title={_('Export as PDF')} />
                <ActionItem
                    title={_('Export as Image (PNG)')}
                    onPress={onClickExportImage}
                />
                <ActionItem title={_('Export as Data (CSV)')} />
            </View>
        </Modal>
    );
};

export default ExportActions;
