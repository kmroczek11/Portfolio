import { memo, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Photo from './Photo'
import Globe from './Globe'
import Texts from './Texts'
import Objects from './Objects'

const Home = memo(() => {
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'home.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <>
            <Photo focus={focus} />
            <Globe />
            <Texts focus={focus} />
            <Objects />
        </>
    )
})

export default Home;