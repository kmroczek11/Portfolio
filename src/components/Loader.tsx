import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useProgress } from '@react-three/drei';

const Loader = (): JSX.Element => {
    const { progress } = useProgress();
    const { t } = useTranslation();
    // console.log(progress);

    return (
        <Text
            color='#d4af37'
            font='fonts/Oswald.ttf'
            fontSize={0.5}
            textAlign='center'
        >
            {t('loadingMessage', { progress: Math.round(progress) })}
        </Text>
    )
}

export default Loader;