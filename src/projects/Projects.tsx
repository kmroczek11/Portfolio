import React, { useContext, useState, useEffect, Fragment } from 'react';
import { AppContext } from '../context';
import { Types } from '../context/reducers';
import Project from './Project';

export interface ProjectItem {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    github: string,
    preview: string,
    x: number,
    y: number,
    active: boolean,
    focus?: boolean,
    onClick?: (id: number) => void,
}

const Projects = React.memo(() => {
    const { state, dispatch } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', github: '', preview: 'http://www.gfe.agh.edu.pl', x: 11.8, y: 1, active: false },
        { id: 1, name: 'shelmo', logos: ['avada'], medium: 'desktop', github: '', preview: 'https://www.shelmo.pl', x: 14, y: 1, active: false },
        { id: 2, name: 'stalcraft', logos: ['angular', 'node', 'jquery'], medium: 'desktop', github: 'https://github.com/kmroczek11/Stalcraft', preview: 'https://stalcraft-page.herokuapp.com', x: 16.2, y: 1, active: false },
        { id: 3, name: 'shop', logos: ['aspnet', 'mysql'], medium: 'desktop', github: 'https://github.com/kmroczek11/Shop', preview: 'http://online-game-store.azurewebsites.net', x: 18.4, y: 1, active: false },
        { id: 4, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', github: 'https://github.com/kmroczek11/Marbles', preview: 'https://marbles-3d-game.herokuapp.com', x: 11.8, y: -1, active: false },
        { id: 5, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', github: 'https://github.com/kmroczek11/MP3-Player', preview: 'https://mp3-player-app.herokuapp.com', x: 14, y: -1, active: false },
        { id: 6, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'mobile', github: 'https://github.com/kmroczek11/Coronastats', preview: '', x: 15.7, y: -1, active: false },
        { id: 7, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'mobile', github: 'https://github.com/kmroczek11/Tasky', preview: '', x: 16.9, y: -1, active: false },
    ]);
    const [selected, setSelected] = useState<number>(null);
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'projects.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    useEffect(() => {
        setProjectItems(prevProjectItems =>
            prevProjectItems.map(
                (e: ProjectItem) =>
                    e.id === selected ?
                        { ...e, active: true } : { ...e, active: false }
            ));
    }, [selected])

    useEffect(() => {
        projectItems.some((e: ProjectItem) => e.active) ?
            dispatch({
                type: Types.SetFullScreen,
                payload: true,
            }) : dispatch({
                type: Types.SetFullScreen,
                payload: false,
            });
    }, [projectItems, dispatch])

    return (
        <>
            {
                projectItems.map(
                    (project: ProjectItem, index: number) =>
                        <Fragment key={index}>
                            <Project
                                {...project}
                                focus={focus}
                                onClick={setSelected}
                            />
                        </Fragment>
                )
            }
        </>
    )
})

export default Projects;