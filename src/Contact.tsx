import React from 'react';
import './styles/contact.css';
import { Html } from '@react-three/drei';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';

const ContactForm = (): JSX.Element => {
    const { t, i18n } = useTranslation();

    return (
        <Html position={[10, 0, 0]} center>
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
    )
}

const Contact = (): JSX.Element => {
    console.log('contact rendered');

    return (
        <ContactForm />
    )
}

export default Contact;