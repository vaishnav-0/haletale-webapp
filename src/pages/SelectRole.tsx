import React from 'react';
import style from './SelectRole.module.scss';
import landlordIcon from '../assets/icons/key.png';
import TenentIcon from '../assets/icons/tenant.png';
import auth from '../functions/auth';
import { useNavigate } from 'react-router-dom';
import { userMutation } from '../queries';
import { useMutation } from '@apollo/client';
import { useAuth } from '../functions/auth/useAuth';
export default function SelectRole() {
    const authData = useAuth();
    const navigate = useNavigate();

    const [setRoleMutation, { data, loading, error }] = useMutation(userMutation.UPDATE_USER_ROLE)

    React.useEffect(() => {
        auth.onAuthStateChange((user) => {
            if (user && user?.role[0] as any !== 'user')
                navigate("/");

        })
    }, [])


    if (data) {
        console.log(data)
        auth.refreshSession();
    }
    if (loading) console.log('Submitting...');
    if (error) console.log(`Submission error! ${error.message}`);

    const setRole = (role: number) => {
        setRoleMutation({ variables: { id: authData?.user!.user_id, role_id: role } },
        )

        
    }

    return <div className={style["container"]}>
        <div className={style["role-container"]}>
            <div className={style["role-item"]}>
                <button onClick={() => setRole(4)}>
                    <div>
                        
                    </div>
                    <img src={landlordIcon} />
                </button>
                <div className={style["role-name"]}>
                    Landlord
                </div>
            </div>
            <div className={style["role-item"]}>
                <button onClick={() => setRole(7)}>
                    <img src={TenentIcon} />
                </button>
                <div className={style["role-name"]}>
                    Tenant
                </div>


            </div>
        </div>
        <div className={style["info"]}>
            Choose your account type. You will not be able to change it later.
        </div>
    </div>
}