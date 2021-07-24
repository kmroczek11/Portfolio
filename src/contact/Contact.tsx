import React, { Suspense, useContext, useEffect, useRef, useState } from 'react';
import '../styles/contact.css';
import { Html, RoundedBox } from '@react-three/drei';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context';
import Loader from '../components/Loader';

const ContactForm = (): JSX.Element => {
    const form = useRef(null);
    const { t } = useTranslation();
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'contact.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <RoundedBox
            ref={form}
            position={[15, 0, 0]}
            args={[5, 6, 0.2]}
            radius={0.1}
        >
            <meshPhongMaterial attach="material" color="#000" />
            <Html
                center
                style={{
                    opacity: focus ? 1 : 0,
                }}
            >
                <Formik
                    initialValues={{ name: '', email: '', phone: '', link: '', message: '' }}
                    validate={values => {
                        const errors = { name: '', email: '', phone: '', link: '', message: '' };
                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errors.email = t('contact.6');
                        if (!values.name) errors.name = t('contact.7');
                        if (!values.email) errors.email = t('contact.7');
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className='contact-form'>
                            <div className='name'>
                                <span className='material-icons'>person</span>
                                <Field type='text' name='name' placeholder={t('contact.0')} />
                                <ErrorMessage className='error' name='name' component='span' />
                            </div>
                            <div className='email'>
                                <span className='material-icons'>email</span>
                                <Field type='email' name='email' placeholder={t('contact.1')} />
                                <ErrorMessage className='error' name='email' component='span' />
                            </div>
                            <div className='phone'>
                                <span className='material-icons'>phone</span>
                                <Field type='tel' name='phone' placeholder={t('contact.2')} />
                                <ErrorMessage className='error' name='phone' component='span' />
                            </div>
                            <div className='link'>
                                <span className='material-icons'>link</span>
                                <Field type='url' name='link' placeholder={t('contact.3')} />
                            </div>
                            <div className='message'>
                                <span className='material-icons'>message</span>
                                <Field type='text' name='message' placeholder={t('contact.4')} as='textarea' />
                            </div>
                            <div className='break' />
                            <button type='submit' disabled={isSubmitting}>{t('contact.5')}</button>
                        </Form>
                    )}
                </Formik>
            </Html>
        </RoundedBox>
    )
}

const Contact = (): JSX.Element => {
    console.log('contact rendered');

    return (
        <Suspense fallback={<Loader />}>
            <ContactForm />
        </Suspense>
    )
}

export default Contact;