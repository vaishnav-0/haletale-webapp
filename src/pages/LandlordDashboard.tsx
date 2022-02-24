import React from 'react';
import style from './LandlordDashboard.module.scss';
import Layout from './Layout';
import { ButtonSolid, ButtonSolidWithIndicator } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Example() {
    const navigate = useNavigate();
    return (
        <Layout>
            <div className={style["wrapper"]}>
                <div className={style["heading"]}>
                    MY PROPERTIES
                </div>
                <div className={style["properties-list"]}>
                    <div className={style["properties-list-card"]}>
                        <div >
                            <div className={style["properties-card-info"]}>
                                <div>Name</div>
                                <div>Appartment</div>
                                <div>14-30 Tichester Road - York,ON</div>
                            </div>
                            <div className={style["properties-card-price"]}>
                                $1200
                            </div>
                        </div>
                        <div>
                            <div className={style["properties-card-status"]}>
                                <span className={style["key"]}>Status: </span>Approved
                            </div>
                            <ButtonSolid className={style["property-card-edit-btn"]} onClick={()=>navigate({pathname:"/editProperty",search:"?id="+"1234"})}>
                                Edit
                            </ButtonSolid>

                        </div>
                        <div className={style["property-card-metadata"]}>
                            <div>
                                <span className={style["key"]}>Views: </span>120
                            </div>
                            <div>
                                <span className={style["key"]}>Requests: </span>3
                            </div>
                            <div>
                                <span className={style["key"]}>Viewed: </span>2 minutes ago
                            </div>
                            <div>
                                <span className={style["key"]}>Other: </span>3
                            </div>
                        </div>
                    </div>
                    <div className={style["properties-list-card"]}>
                        <div >
                            <div className={style["properties-card-info"]}>
                                <div>Name</div>
                                <div>Condo</div>
                                <div>89 Mcgill Street - Torronto, On</div>
                            </div>
                            <div className={style["properties-card-price"]}>
                                $1500
                            </div>
                        </div>
                        <div>
                            <div className={style["properties-card-status"]}>
                                <span className={style["key"]}>Status: </span>Pending approval
                            </div>
                            <ButtonSolid className={style["property-card-edit-btn"]}>
                                Edit
                            </ButtonSolid>

                        </div>
                    </div>
                </div>
                <div className={style["btn-container"]}>
                    <ButtonSolid>
                        List Properties
                    </ButtonSolid>
                    <ButtonSolidWithIndicator indicator={<div className={style["btn-indicator"]}>5</div>}>
                        Tenant Request
                    </ButtonSolidWithIndicator>
                </div>
            </div>
        </Layout >
    );
}