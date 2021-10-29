import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/contact.css';
import { Html, RoundedBox } from '@react-three/drei';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Icon from '@material-ui/core/Icon';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context';
import emailjs, { init } from 'emailjs-com';
import DialogBox from '../components/DialogBox';

const ContactForm = (): JSX.Element => {
    const form = useRef(null);
    const { t } = useTranslation();
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);
    const [msgStatus, setMsgStatus] = useState<string>('unsent');

    useEffect(() => init(process.env.REACT_APP_USER_ID), [])

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
            <meshPhongMaterial attach='material' color='#000' />
            <Html
                center
                zIndexRange={[0, 0]}
                style={{
                    transition: 'all 0.5s',
                    opacity: focus ? 1 : 0,
                    transform: `translate(-50%, -50%) scale(${focus ? 1 : 0.5})`
                }}
            >
                {msgStatus === 'processing' ?
                    <img
                        src='/images/sending.gif'
                        alt='sending'
                        style={{
                            width: '40vw',
                            maxWidth: '40vw',
                            height: '40vh'
                        }}
                    />
                    :
                    <Formik
                        initialValues={{ firstname: '', lastname: '', email: '', phone: '', message: '' }}
                        validate={values => {
                            let errors = {};
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errors = { ...errors, email: t('contact.6') };
                            if (!values.firstname) errors = { ...errors, firstname: t('contact.7') };
                            if (!values.lastname) errors = { ...errors, lastname: t('contact.7') };
                            if (!values.email) errors = { ...errors, email: t('contact.7') };
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            setMsgStatus('processing');
                            setTimeout(() => {
                                emailjs.send(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, values)
                                    .then((result) => {
                                        setMsgStatus('sent');
                                    },
                                        (error) => {
                                            setMsgStatus('error');
                                            console.log(error.toString());
                                        });
                                setSubmitting(false);
                                resetForm();
                            }, 400);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className='contact-form'>
                                <div className='firstname'>
                                    <Icon>person</Icon>
                                    <Field type='text' name='firstname' placeholder={t('contact.0')} />
                                    <ErrorMessage className='error' name='firstname' component='span' />
                                </div>
                                <div className='surname'>
                                    <Icon>person</Icon>
                                    <Field type='text' name='lastname' placeholder={t('contact.1')} />
                                    <ErrorMessage className='error' name='lastname' component='span' />
                                </div>
                                <div className='email'>
                                    <Icon>email</Icon>
                                    <Field type='email' name='email' placeholder={t('contact.2')} />
                                    <ErrorMessage className='error' name='email' component='span' />
                                </div>
                                <div className='phone'>
                                    <Icon>phone</Icon>
                                    <Field type='tel' name='phone' placeholder={t('contact.3')} />
                                </div>
                                <div className='message'>
                                    <Icon>message</Icon>
                                    <Field type='text' name='message' placeholder={t('contact.4')} as='textarea' />
                                </div>
                                <div className='break' />
                                <button type='submit' disabled={isSubmitting}>{t('contact.5')}</button>
                            </Form>
                        )}
                    </Formik>
                }
                {
                    msgStatus === 'sent' &&
                    <DialogBox
                        title={t('emailDialog.0')}
                        content={t('emailDialog.1')}
                        agreeTxt={t('emailDialog.2')}
                        onAgreed={() => setMsgStatus('unsent')}
                    />
                }
                {
                    msgStatus === 'error' &&
                    <DialogBox
                        title={t('emailDialog.3')}
                        content={t('emailDialog.4')}
                        agreeTxt={t('emailDialog.2')}
                        onAgreed={() => setMsgStatus('unsent')}
                    />
                }
            </Html>
        </RoundedBox>
    )
}

const Contact = (): JSX.Element => {
    console.log('contact rendered');

    return <ContactForm />
}

export default Contact;