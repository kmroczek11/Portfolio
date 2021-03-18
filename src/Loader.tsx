import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useProgress } from '@react-three/drei';

const Loader = (): JSX.Element => {
    const { progress } = useProgress();
    const { t, i18n } = useTranslation();
    console.log(progress);

    return <Text
        color='#ff4d17'
        font='fonts/Oswald.ttf'
        fontSize={0.5}
        textAlign='center'
    >
        {t('loadingMessage', { progress: progress })}
    </Text>
}

export default Loader;