import { memo, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Photo from './Photo'
import Globe from './Globe'
import Texts from './Texts'
import Objects from './Objects'

const Home = memo(() => {
    console.log('home rendered');
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'home.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <>

            <Photo focus={focus} />
            <Globe focus={focus} />
            <Texts focus={focus} />
            <Objects />
        </>
    )
})

export default Home;