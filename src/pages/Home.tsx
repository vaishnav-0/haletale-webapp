import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import Searchbar from '../components/Searchbar';


// 

import {getExpiry} from '../functions/auth'
import { nextTick } from 'process';
// 
function HomePage(): JSX.Element {
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar />
            </div>
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <MinimalPropertyList title="Popular properties" />
                <MinimalPropertyList title="Newly listed properties" />
            </div>
            <button onClick={()=> getExpiry("eyJraWQiOiJmXC9ONVwvWDZJV2xNQ0EwMFpvVDFwS2tPNTRGa3FxQ0VVdGhsMFMyUitpc0k9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiNmdnejBnSGpBV1JWOFhvY1hrUVg5ZyIsInN1YiI6ImZiYmY3NGQxLTk1OTEtNDU4Yi1iYmU5LTYxNDM4NzlhYTY5NSIsImNvZ25pdG86Z3JvdXBzIjpbImNhLWNlbnRyYWwtMV9pTzBxTWNvdGJfR29vZ2xlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaHR0cHM6XC9cL2hhc3VyYS5pb1wvand0XC9jbGFpbXMiOiJ7XCJ4LWhhc3VyYS11c2VyLWlkXCI6XCJmYmJmNzRkMS05NTkxLTQ1OGItYmJlOS02MTQzODc5YWE2OTVcIixcIngtaGFzdXJhLWRlZmF1bHQtcm9sZVwiOlwidXNlclwiLFwieC1oYXN1cmEtYWxsb3dlZC1yb2xlc1wiOltcInVzZXJcIl19IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmNhLWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9jYS1jZW50cmFsLTFfaU8wcU1jb3RiIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Imdvb2dsZV8xMTM0NDIxNTM4MDkyODY4ODg4NjQiLCJhdWQiOiI3cW43dnVqZDJ2bmFmaWczNDk0a3RhY2FlMSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjExMzQ0MjE1MzgwOTI4Njg4ODg2NCIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2NDE1MzI1MDYwNDQifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQxNTM1MTMzLCJleHAiOjE2NDE1Mzg3MzMsImlhdCI6MTY0MTUzNTEzMywianRpIjoiMjg3MzYzOGUtOWRjNi00MDg4LWJjM2YtZDk3NDNjMTYyZWQ1IiwiZW1haWwiOiJsaWFwYXVsOTg5NUBnbWFpbC5jb20ifQ.x-PrP-EgYJBN56KGq-4c-pIDiDVgtuULbN6mH7OhIjz32jyLMXb17NlqYkLXdHCyqrhV8r2MAfeODUTrRrNN7XA-sIxMEgMQQLKtQpWjUgpzRb6Ef_Yh1lhPAxOnk9e5oHW-0SPjM387fp5wR9yyEoly3HKbqBL_ECzh7MiV-NW--_pqzaT4NIC2BT5eoK0FkChM6BV4ArYNsq_E4bd7eeQRZnu9TdolM1d5TuZQV77u9FEQxsFycB44lfJxNNyd6r0rKyTy4NWqN5hmz7x7hCxKhbJwxnX7lfjosHECXdRAgshf3flrSTrxA4-8d5beugs1lkwqmh8NOmXsk72S_A")}></button>
        </Layout>
    );
}

export default HomePage;
