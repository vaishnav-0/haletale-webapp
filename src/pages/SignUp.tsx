import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/';
import { RadioButtonGroup } from '../components/Form/';
import { CheckBox } from '../components/Form/';
import { TimeField } from '../components/Form/';
import { ButtonSolid } from '../components/Button';
import PositionIndicator from '../components/PositionIndicator';
import { useForm, FormProvider } from 'react-hook-form';

function Signup(): JSX.Element {
    const methods = useForm();
    const onSubmit = (d: any) => {
        console.log(d);

    }
    const handleSubmit = methods.handleSubmit(onSubmit, d => console.log(d));
    return (
        <Layout>
            <FormProvider {...methods}>
                <form className={style["form-container"]} onSubmit={e => { e.preventDefault(); handleSubmit() }}>
                    <div className={style["form-header"]}>
                        Sign Up
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            First name
                        </div>
                        <TextInput name="firstName" placeholder='Enter first name' type="text" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Last name
                        </div>
                        <TextInput name="lastName" placeholder='Enter last name' type="text" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Email address
                        </div>
                        <TextInput name="email" placeholder='Enter email address' type="text" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Password
                        </div>
                        <TextInput name="password" placeholder='Enter password' type="password" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Confirm Password
                        </div>
                        <TextInput name="password-confirm" placeholder='Confirm your password' type="password" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Date of birth
                        </div>
                        <TimeField name="dob" type="date" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Gender
                        </div>
                        <div className={style["horizontal-list"]}>
                            <RadioButtonGroup name="gender" values={{ "male": "Male", "female": "Female", "other": "Other" }} />
                        </div>
                    </div>
                    <div className={style["form-item"]}>
                        <div style={{ display: "flex" }}>
                            <CheckBox value='true' label="" name="privacyAgree" />
                            <div>
                                By creating your account you agree to our <a href='#'>terms and condtions</a>
                            </div>
                        </div>

                    </div>
                    <ButtonSolid className={style["form-submit-btn"]} >Sign Up</ButtonSolid>
                </form>
            </FormProvider>
        </Layout>
    );
}

export default Signup;