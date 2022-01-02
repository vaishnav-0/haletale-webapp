import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/components/TextInput';
import RadioButtonGroup from '../components/Form/components/RadiobuttonGroup';
import { CheckBox } from '../components/Form/components/ToggleButtons';
import { TimeField } from '../components/Form/components/TimeField';
import { ButtonSolid } from '../components/Button';
import PositionIndicator from '../components/PositionIndicator';

function Signup(): JSX.Element {
    return (
        <Layout>
            <form className={style["form-container"]}>
                <div className={style["form-header"]}>
                    Sign Up
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        First name
                    </div>
                    <TextInput placeholder='Enter first name' type="text" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Last name
                    </div>
                    <TextInput placeholder='Enter last name' type="text" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Email address
                    </div>
                    <TextInput placeholder='Enter email address' type="text" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Date of birth
                    </div>
                    <TimeField type="date" />
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
                <PositionIndicator count={4} position={3} />
                <ButtonSolid label='Sign Up' className={style["form-submit-btn"]} />
            </form>
        </Layout>
    );
}

export default Signup;