import React from 'react';
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import propertyQuery, { IGetAllPropertyData, IPropertyDetails } from '../../../queries/property.query';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../../components/ImageSlider';
import propertyMutation from '../../../queries/property.mutation';
import { useLoader } from '../../../components/Loader';
import Table from '../../../components/Table';

export default function Properties() {
  const navigate = useNavigate();

  const { data: allPropertyData, loading: propertyLoading, refetch } = useQuery<IGetAllPropertyData>(propertyQuery.GET_ALL_PROPERTIES, {
    fetchPolicy: "cache-and-network"
  });
  React.useEffect(() => {
    if (propertyLoading)
      setLoader(true)
    else
      setLoader(false)
  }, [propertyLoading])
  const [Loader, setLoader] = useLoader({});
  const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedutationLoading }] = useMutation(propertyMutation.UPDATE_IS_APPROVED, { onCompleted: refetch })
  const [data, setData] = React.useState<readonly IPropertyDetails[]>([]);
  const [current_page, setPage] = React.useState<Number>(0);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const result = React.useMemo(() => allPropertyData?.property ?? [], [allPropertyData])


  const columns = React.useMemo<{ Header: string, accessor: string | undefined | ((d: IPropertyDetails) => string | number | undefined | JSX.Element) }[]>(
    () => [
      {
        Header: 'Id',
        accessor: (data) => <button title={data.id} style={{ width: "100px" }} className={style["link-btn"]} onClick={() => navigate("/property/view?id=" + data.id)}>{data.id}</button>,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Approval',
        accessor: (data) => <button onClick={() => setApprovedMutation({ variables: { id: data.id, is_approved: !data.is_approved } })} className={`${style["property-approve-btn"]} ${data.is_approved ? style["disapprove"] : ""}`}>{data.is_approved ? "Remove approval" : "Approve"}</button>,
      },
      {
        Header: 'Full Address',
        accessor: (data) => data.property_address?.address?.full_address,
      },
      {
        Header: 'Type & Subtype',
        accessor: (data) => data.property_type.name + " " + data.property_subtype.name
      },
      {
        Header: 'Rent Amount',
        accessor: (data) => data.property_detail?.rent_amount,
      },
      {
        Header: "Images",
        accessor: (data) => <ImageSlider className={style["image-slider"]} aspectRatio={16 / 9} imgSrc={data.property_images?.map(e => e!.s3Url!.url as string) ?? []} />
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'features',
        accessor: (data) => data.property_detail?.features?.join(' '),
      },
      {
        Header: 'Resrictions',
        accessor: (data) => data.property_detail?.restrictions?.join(' '),
      },
      {
        Header: "Rooms",
        accessor: (data) => Object.entries(data.property_detail?.rooms ?? {}).map(([k, v]) => k + ":" + v).join(' ')
      },
      {
        Header: "Max occupant",
        accessor: (data) => data.property_detail?.max_occupants
      },
      {
        Header: 'Listed',
        accessor: (data) => data.is_listed.toString(),
      },

    ],
    []
  )


  // chng page

  return <>
    {Loader}
    <div>
      <Table columns={columns} data={result} />
    </div>
  </>
}


// table fn reusabl..







