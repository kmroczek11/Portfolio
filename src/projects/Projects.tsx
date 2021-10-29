import React, { useContext, useState, useEffect, Fragment } from 'react';
import { AppContext } from '../context';
import { Types } from '../context/reducers';
import Project from './Project';

export interface ProjectItem {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    preview: string,
    x: number,
    y: number,
    active: boolean,
    focus?: boolean,
    onClick?: (id: number) => void,
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const { state, dispatch } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', preview: 'http://www.gfe.agh.edu.pl', x: 11.8, y: 1, active: false },
        { id: 1, name: 'shelmo', logos: ['avada'], medium: 'desktop', preview: 'https://www.shelmo.pl', x: 14, y: 1, active: false },
        { id: 2, name: 'stalcraft', logos: ['angular', 'node'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Stalcraft', x: 16.2, y: 1, active: false },
        { id: 3, name: 'shop', logos: ['aspnet', 'mysql'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Shop', x: 18.4, y: 1, active: false },
        { id: 4, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Marbles', x: 11.8, y: -1, active: false },
        { id: 5, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', preview: 'https://github.com/kmroczek11/School-projects/tree/master/MP3%20Player', x: 14, y: -1, active: false },
        { id: 6, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'mobile', preview: 'https://github.com/kmroczek11/Coronastats', x: 15.7, y: -1, active: false },
        { id: 7, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'mobile', preview: 'https://github.com/kmroczek11/Tasky', x: 16.9, y: -1, active: false },
        // { id: 7, name: '', logos: ['react', 'sass'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Portfolio', x: 19.5, y: -1, active: false },
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