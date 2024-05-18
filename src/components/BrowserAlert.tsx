import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@react-three/drei';

const BrowserAlert = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Text
            color='#d4af37'
            font='fonts/Oswald.ttf'
            fontSize={0.5}
            textAlign='center'
        >
            {t('browserMessage')}
        </Text>
    )
}

export default BrowserAlert;