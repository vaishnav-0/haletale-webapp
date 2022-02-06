import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/';
import { RadioButtonGroup as UnwrappedRadio } from '../components/Form/components/RadiobuttonGroup';
import { RadioButtonGroup } from '../components/Form/';
import { Select } from '../components/Form/';
import { CheckBox } from '../components/Form/';
import { TimeField } from '../components/Form/';
import { ButtonSolid } from '../components/Button';
import { NumberInput } from '../components/Form/';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { FileInputButton } from '../components/Form/';
import FieldArrayWrapper from '../components/Form/FieldArrayWrapper';

function SendRequest(): JSX.Element {
    //const { list, add, remove } = useListState<any>([]);
    const [withOthers, setWithOthers] = React.useState<boolean>(false);
    const [landlordRef, setLandlordRef] = React.useState<boolean>(true);
    const setCountRef = React.useRef<(v: number) => void>(() => { });
    const methods = useForm();
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "members"
    });
    const onSubmit = (d: any) => console.log(d)
    return (
        <Layout>
            <FormProvider {...methods}>
                <form className={style["form-container"]} onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className={style["form-header"]}>
                        Send Request
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Current residential address
                        </div>
                        <TextInput type='text' placeholder='Your answer'
                            name="living" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Current status in Canada
                        </div>
                        <RadioButtonGroup name="status"
                            values={{
                                "study": "Study permit", "work": "Work permit", "pr": "Permenent resident"
                                , "citizen": "Canadian citizen", "visitor": "Visitor", "other": "Other"
                            }}
                        />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Occupation
                        </div>
                        <TextInput type='text' placeholder='Your answer'
                            name="occupation" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Total annual household income(total including)
                        </div>
                        <TextInput type='text' placeholder='Your answer'
                            name="income" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Reasons for moving out of current place
                        </div>
                        <TextInput type='text' placeholder='Your answer'
                            name="living" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Intended move in date:
                        </div>
                        <TimeField type='date' placeholder='Your answer'
                            name="movein" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Intended lease duration:
                        </div>
                        <RadioButtonGroup name="status"
                            values={{ "less1": "Less than 1 year", "1": "1 year", "more1": "More than 1 year" }}
                        />
                    </div>
                    {
                        withOthers && <>
                            <div className={style["form-section-heading"]}>
                                HOUSEMATES DETAILS
                            </div>
                            <FieldArrayWrapper name="members">
                                {({ fields, append, remove }) => <>

                                    <div className={`${style["form-item"]} ${style["paper"]} ${style["center"]} ${style["fit"]} ${style["col1"]}`}>
                                        <div className={style["form-item-heading"]}>
                                            Number of tenants:
                                        </div>
                                        <NumberInput
                                            name="tenantCount"
                                            onIncrement={(v) => {
                                                append({ name: '', relation: 0, addToLease: false });
                                            }}
                                            disabled={[0]}
                                            setValueRef={setCountRef}
                                        />
                                    </div>
                                    <div className={`${style["form-item"]}`}>

                                        {fields.map((e, i) => {
                                            console.log(e);
                                            return <div key={e.id} className={style["form-item"]}>
                                                <div className={style["horizontal-list"]}>
                                                    <div>Member {i + 1}</div>
                                                    <button type="button" className={style["remove-btn"]}
                                                            console.log("clicked");
                                                            setCountRef.current(fields.length - 1)
                                                            remove(i);
                                                        }}
                                                    >
                                                        <i className="fas fa-minus" /></button>
                                                </div>
                                                <div className={style["horizontal-list"]}>
                                                    <TextInput name={`members[${i}].name`} type="text" placeholder='Name' />
                                                    <Select name={`members[${i}].relation`} values={{ 0: "Select relation", 1: "relation1", 2: "relation2" }} />
                                                    <CheckBox name={`members[${i}].addToLease`} label='Add to lease' />
                                                </div>
                                            </div>
                                        })
                                        }
                                    </div>
                                </>
                                }
                            </FieldArrayWrapper>
                        </>
                    }
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Can you provide previous landlord reference?
                        </div>
                        <div className={style["horizontal-list"]}>
                            <UnwrappedRadio
                                name='landlordRef'
                                values={["Yes", "No"]}
                                defaultValue="Yes"
                                onChange={(e) => setLandlordRef(e.target.value === "Yes")}
                            />
                        </div>
                    </div>
                    {
                        landlordRef && <>
                            <div className={style["form-section-heading"]}>
                                Previous Landlord Reference
                            </div>
                            <div className={style["form-item"]}>
                                <div className={style["form-item-heading"]}>
                                    Email
                                </div>
                                <TextInput type='text' placeholder='Your answer'
                                    name="occupation" />
                            </div>
                            <div className={style["form-item"]}>
                                <div className={style["form-item-heading"]}>
                                    Phone Number
                                </div>
                                <TextInput type='text' placeholder='Your answer'
                                    name="occupation" />
                            </div>
                        </>
                    }
                    <div className={style["form-item"] + " " + style["paper"]}>
                        <div className={style["form-item-heading"]}>
                            Attach Documents
                        </div>
                        <FileInputButton name='doc1' />
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