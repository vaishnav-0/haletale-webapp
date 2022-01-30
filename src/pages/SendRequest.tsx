import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/';
import RadioButtonGroup from '../components/Form/components/RadiobuttonGroup';
import { Select } from '../components/Form/components/Select';
import { CheckBox } from '../components/Form/';
import { TimeField } from '../components/Form/components/TimeField';
import { ButtonSolid } from '../components/Button';
import PositionIndicator from '../components/PositionIndicator';
import { NumberInput } from '../components/Form/components/NumberInput';
import useListState from '../functions/hooks/useListState';
import { useForm, FormProvider } from 'react-hook-form';

function SendRequest(): JSX.Element {
    const { list, add, remove } = useListState<any>([]);
    const methods = useForm();
    return (
        <Layout>
            <FormProvider {...methods}>
                <form className={style["form-container"]}>
                    <div className={style["form-header"]}>
                        Send Request
                    </div>
                    <div className={style["form-item"] + " " + style["paper"]}>
                        <div className={style["radio-group-vertical"]}>
                            {//<RadioButtonGroup name="living" values={{ "male": "I will live with my family", "female": "I will live with other tenents" }} />
                            }
                        </div>
                    </div>
                    <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                        <div className={style["form-item-heading"]}>
                            Adults
                        </div>
                        <NumberInput
                            onIncrement={(v) => {
                                add(v);
                            }}
                            disabled={[0]}
                        />
                    </div>
                    <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                        <div className={style["form-item-heading"]}>
                            Kids
                        </div>
                        <NumberInput
                            disabled={[0]}
                        />
                    </div>
                    <div className={`${style["form-item"]}`}>
                        {
                            list.map((e, i) => {
                                return <div key={i} className={style["form-item"]}>
                                    <div className={style["horizontal-list"]}>
                                        <div>Member {e}</div>
                                        <button type="button" className={style["remove-btn"]}
                                            onClick={() => {
                                                console.log("clicked")
                                                //setAdultCount(prev => prev > 1 ? prev - 1 : 0);
                                                remove(i);
                                            }}
                                        >
                                            <i className="fas fa-minus" /></button>
                                    </div>
                                    <div className={style["horizontal-list"]}>
                                        <TextInput name={"name" + i} type="text" placeholder='Name' />
                                        <Select name={"relation" + i} values={{ 0: "Select relation", 1: "relation1", 2: "relation2" }} />
                                        <CheckBox name="addToLease" value='Add to lease' />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <ButtonSolid className={style["form-submit-btn"]}>
                        Send Request
                    </ButtonSolid>
                </form>
            </FormProvider>
        </Layout>
    );
}

export default SendRequest;