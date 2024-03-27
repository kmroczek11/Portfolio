import { Html } from '@react-three/drei';
import React, { useContext, useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import DialogBox from '../components/DialogBox';
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
    commercial: boolean,
    focus?: boolean,
    onClick?: (id: number) => void,
}

const Projects = React.memo(() => {
    const { state, dispatch } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'webapp-playground', logos: ['qwik','tailwind','viem'], medium: 'desktop', github: 'https://github.com/kmroczek11/webapp-playground', preview: '', x: 11.8, y: 1, active: false, commercial: false },
        { id: 1, name: 'protricks', logos: ['typescriptreact', 'mui', 'nest', 'postgresql', 'graphql', 'typeorm'], medium: 'desktop', github: '', preview: 'https://protricks-2411a7446093.herokuapp.com/', x: 14, y: 1, active: false, commercial: true },
        { id: 2, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', github: '', preview: 'http://www.gfe.agh.edu.pl', x: 16.2, y: 1, active: false, commercial: true },
        { id: 3, name: 'shelmo', logos: ['avada'], medium: 'desktop', github: '', preview: 'https://www.shelmo.pl', x: 18.4, y: 1, active: false, commercial: true },
        { id: 4, name: 'stalcraft', logos: ['angular', 'node', 'jquery'], medium: 'desktop', github: 'https://github.com/kmroczek11/Stalcraft', preview: 'https://stalcraft-page.herokuapp.com', x: 11.8, y: -1, active: false, commercial: true },
        { id: 5, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', github: 'https://github.com/kmroczek11/Marbles', preview: 'https://marbles-3d-game.herokuapp.com', x: 14, y: -1, active: false, commercial: false },
        { id: 6, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', github: 'https://github.com/kmroczek11/MP3-Player', preview: 'https://mp3-player-app.herokuapp.com', x: 16.2, y: -1, active: false, commercial: false },
        { id: 7, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'mobile', github: 'https://github.com/kmroczek11/Coronastats', preview: '', x: 17.8, y: -1, active: false, commercial: false },
        { id: 8, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'mobile', github: 'https://github.com/kmroczek11/Tasky', preview: '', x: 18.9, y: -1, active: false, commercial: false },
    ]);
    const [selected, setSelected] = useState<number>(null);
    const [focus, setFocus] = useState<boolean>(false);
    const [visited, setVisited] = useState<boolean>(false);
    const { t } = useTranslation();

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
            {
                focus && !visited &&
                <Html center>
                    <DialogBox
                        title={t('projectsDialog.0')}
                        content={t('projectsDialog.1')}
                        agreeTxt={t('projectsDialog.2')}
                        onAgreed={() => setVisited(true)}
                    />
                </Html>
            }
        </>
    )
})

export default Projects;