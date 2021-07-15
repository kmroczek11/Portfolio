import { memo, Suspense, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Loader from '../components/Loader';
import Photo from './Photo'
import Objects from './Objects'
import Texts from './Texts'
import Globe from './Globe'

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
            <Suspense fallback={<Loader />}>
                <Photo focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Globe focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Texts focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Objects />
                {/* <Preload all /> */}
            </Suspense>
        </>
    )
})

export default Home;