import React from 'react';
import style from './SelectRole.module.scss';
import landlordIcon from '../assets/icons/key.png';
import TenentIcon from '../assets/icons/tenant.png';
import auth from '../functions/auth';
import { useNavigate } from 'react-router-dom';
export default function SelectRole() {
    const navigate = useNavigate();
    const onClick = () => {

    }
    React.useEffect(() => {
        auth.onAuthStateChange((user) => {
            if (user && user?.role[0] as any !== 'user')
                navigate("/");
        })
    }, [])
    return <div className={style["container"]}>
        <div className={style["role-container"]}>
            <div className={style["role-item"]}>
                <button>
                    <img src={landlordIcon} />
                </button>
                <div className={style["role-name"]}>
                    Landlord
                </div>
            </div>
            <div className={style["role-item"]}>
                <button>
                    <img src={TenentIcon} />
                </button>
                <div className={style["role-name"]}>
                    Tenant
                </div>
            </div>
        </div>
    </div>
}