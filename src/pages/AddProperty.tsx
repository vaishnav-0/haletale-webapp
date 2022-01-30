import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/';
import { NumberInput } from '../components/Form/';
import RadioButtonGroup from '../components/Form/components/RadiobuttonGroup';
import { PillList } from '../components/Form/';
import { CheckBox } from '../components/Form/';
import { TimeField } from '../components/Form/components/TimeField';
import { TextArea } from '../components/Form/';
import { Select } from '../components/Form/';
import { ImageUpload } from '../components/Form/';
import { ButtonSolid } from '../components/Button';
import { FileInputButton } from '../components/Form/';
import { useForm, FormProvider } from 'react-hook-form';
import { object, string, number, date, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PillCollection } from '../components/Form/components/PillList';

const formSchema = object({
    address: string().required(),
    rent: number().required(),
    hydroPercent: number().max(100)
});
type FormSchemaType = InferType<typeof formSchema>;

function AddProperty(): JSX.Element {
    const methods = useForm<FormSchemaType>({
        resolver: yupResolver(formSchema)
    });

    const handleSubmit = methods.handleSubmit(d => console.log(d), d => console.log(d));
    console.log("addProperty");
    return (
        <Layout>
            <FormProvider {...methods}>
                <form className={style["form-container"]} onSubmit={e => { e.preventDefault(); handleSubmit() }}>
                    <div className={style["form-header"]}>
                        Add Property
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Address
                        </div>
                        <TextInput name="address" placeholder='Enter property address' type="text" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Images
                        </div>
                        <ImageUpload name="images" resolutionType='ratio' resolutionWidth={16} resolutionHeight={9}
                        //  tags={{
                        //       single: {[{ name: "cover", limit: 1,value:"cover" }]},
                        //       group: [{name:"roomtype",tags:["bedroom","bathroom"],limit:5}]
                        //   }
                        //   }
                        />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Property type
                        </div>
                        <Select name="type" values={{ "-": "", "1": "Detatched", "2": "Lawn moving" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Property subtype
                        </div>
                        <Select name="subtype" values={{ "-": "", "snow": "Main level", "lawn": "Basement" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Bedroom
                        </div>
                        <Select name="bedroom" values={{ "-": "", "snow": "1", "lawn": "2" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Bathroom
                        </div>
                        <Select name="bathroom" values={{ "-": "", "snow": "1", "lawn": "2" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Lease term
                        </div>
                        <Select name="lease_term" values={{ "-": "", "snow": "6 Months to 1 year", "lawn": "1 year" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Move in date:
                        </div>
                        <TimeField name="movein" type="date" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Maximum Occupants
                        </div>
                        <NumberInput name="max_occupants" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Parking
                        </div>
                        <Select name="parking" values={{ "-": "", "snow": "0", "lawn": "1", "2": "2" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Features and amenities
                        </div>
                        <PillList name="features"
                            disabledKeys={['stove', 0]}
                            defaultValues={['dishwasher', 3]}
                            //maxActive={1}
                            disabledActivatableKeys={[2]}
                            onClick={(a, b) => console.log(a, b)}
                            items={{
                                fridge: "Fridge", stove: "Stove", dishwasher: "Dishwasher", microwave: "Microwave",
                                nosmoking: "No smoking", stove2: "Stove"
                            }}
                        />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Pets
                        </div>
                        <Select name="pets" values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                    </div>
                    <PillCollection
                        items={{
                            single: [{ name: "cover", limit: 1, value: "cover" }, { name: "abc", value: "abc", limit: 5 }],
                            group: [{ name: "roomtype", items: ["bedroom", "bathroom"], limit: 1 }]
                        }}
                    >
                        {
                            ({ List, Groups }) => {
                                return <>
                                    <div className={style["form-item"]}>
                                        <div className={style["form-item-heading"]}>
                                            list1
                                        </div>
                                        <List />
                                        <Groups.roomtype />
                                    </div>
                                    <div className={style["form-item"]}>
                                        <div className={style["form-item-heading"]}>
                                            list2
                                        </div>
                                        <List />
                                        <Groups.roomtype />

                                    </div>
                                </>
                            }
                        }
                    </PillCollection>

                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Smoking
                        </div>
                        <Select name="smoking" values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Rent
                        </div>
                        <TextInput name="rent" placeholder='Enter amount' type="number" />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Pay by Landlord
                        </div>
                        <div className={style["horizontal-list"]}>
                            <CheckBox name="check" value="hydro" label="Hydro" />
                            <CheckBox name="check" value="water" label="Water" />
                            <CheckBox name="check" value="heat" label="Heat" />
                        </div>
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Hydro
                        </div>
                        <TextInput name="hydoPercent" placeholder='Enter hydro percentage' type="text" >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                %
                            </div>
                        </TextInput>
                    </div>
                    {<div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Address verification document
                        </div>
                        <FileInputButton name="filetest" />
                    </div>

                    }
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Outdoor maintainance
                        </div>
                        <Select name="outdoor_maintainance" values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                    </div>
                    <div className={style["form-item"]}>
                        <div className={style["form-item-heading"]}>
                            Additional notes
                        </div>
                        <TextArea name="notes" rows={10} />
                    </div>
                    <ButtonSolid className={style["form-submit-btn"]} >Next</ButtonSolid>
                </form>
            </FormProvider>
        </Layout >
    );
}

export default AddProperty;