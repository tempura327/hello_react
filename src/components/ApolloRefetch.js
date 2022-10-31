import { useQuery, gql } from '@apollo/client';

import { useEffect, useState } from 'react';

import Chip from '@mui/material/Chip';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';

export default function ApolloRefetch(props){
  const [id, setId] = useState('1');

  const {isIdLoading, isIdError, data:idData} = useQuery(gql`
    query historyId{
      histories{
        id
      }
    }
  `);

  console.log(idData);
  
  const { loading, error, data } = useQuery(gql`
  query history($id:ID!){
    history(id:$id){
      details
      event_date_utc
      flight {
        launch_success
        mission_name
      }
      title
    }
  }
  `, {variables:{id:id}});

//   console.log(data);

  if (isIdLoading) return <p>loading...</p>;
  if (isIdError) return <p>Error :(</p>;

  return (
    <div className='flex justify-around items-center h-screen'>
        {
            idData?.histories?.map((i, index) => <Chip key={index} label={i.id}></Chip>)
        }
    </div>
  )
}