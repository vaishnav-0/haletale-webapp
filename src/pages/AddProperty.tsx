import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import { TextInput } from '../components/Form/components/TextInput';
import { NumberInput } from '../components/Form/components/NumberInput';
import RadioButtonGroup from '../components/Form/components/RadiobuttonGroup';
import { PillList } from '../components/Form/components/PillList';
import { CheckBox } from '../components/Form/components/ToggleButtons';
import { TimeField } from '../components/Form/components/TimeField';
import { TextArea } from '../components/Form/components/TextArea';
import { Select } from '../components/Form/components/Select';
import { ImageUpload } from '../components/Form/components/Images';
import { ButtonSolid } from '../components/Button';
import { FileInputButton } from '../components/Form/components/FileInputButton';

function AddProperty(): JSX.Element {
    return (
        <Layout>
            <form className={style["form-container"]}>
                <div className={style["form-header"]}>
                    Add Property
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Address
                    </div>
                    <TextInput placeholder='Enter property address' type="text" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Images
                    </div>
                    <ImageUpload resolutionType='ratio' resolutionWidth={16} resolutionHeight={9} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Property type
                    </div>
                    <Select values={{ "-": "", "1": "Detatched", "2": "Lawn moving" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Property subtype
                    </div>
                    <Select values={{ "-": "", "snow": "Main level", "lawn": "Basement" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Bedroom
                    </div>
                    <Select values={{ "-": "", "snow": "1", "lawn": "2" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Bathroom
                    </div>
                    <Select values={{ "-": "", "snow": "1", "lawn": "2" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Lease term
                    </div>
                    <Select values={{ "-": "", "snow": "6 Months to 1 year", "lawn": "1 year" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Move in date:
                    </div>
                    <TimeField type="date" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Maximum Occupants
                    </div>
                    <NumberInput />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Parking
                    </div>
                    <Select values={{ "-": "", "snow": "0", "lawn": "1", "2": "2" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Features and amenities
                    </div>
                    <PillList items={["Fridge", "Stove", "Dishwasher", "Microwave", "No smoking", "Stove", "Dishwasher", "Microwave", "No smoking"]} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Pets
                    </div>
                    <Select values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Smoking
                    </div>
                    <Select values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Rent
                    </div>
                    <TextInput placeholder='Enter amount' type="text" />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Pay by Landlord
                    </div>
                    <div className={style["horizontal-list"]}>
                        <CheckBox name="check" value="c" label="Hydro" />
                        <CheckBox name="check" value="c" label="Water" />
                        <CheckBox name="check" value="c" label="Heat" />
                    </div>
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Hydro
                    </div>
                    <TextInput placeholder='Enter hydro percentage' type="text" >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            %
                        </div>
                    </TextInput>
                </div>
                {/*   <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Address verification document
                    </div>
                    <FileInputButton />
                </div>
                */
                }
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Outdoor maintainance
                    </div>
                    <Select values={{ "-": "", "snow": "Yes", "lawn": "No" }} />
                </div>
                <div className={style["form-item"]}>
                    <div className={style["form-item-heading"]}>
                        Additional notes
                    </div>
                    <TextArea rows={10} />
                </div>
                <ButtonSolid label='Next' className={style["form-submit-btn"]} />
            </form>
        </Layout>
    );
}

export default AddProperty;