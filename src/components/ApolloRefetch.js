import { useQuery, gql } from '@apollo/client';

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

function timeFormatter(str){
  if(!str) return '';
  return str.replace(/T|Z/g, ' ');
}

export default function ApolloRefetch(props){
  const queryMultiple = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res1 = useQuery(gql`
    query historyId{
      histories{
        id
      }
    }
  `);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res2 = useQuery(gql`
    query history($id:ID!){
      history(id:$id){
        details
        event_date_utc
        flight {
          launch_success
          mission_name
        }
        title
        id
      }
    }
    `, {variables:{id:'1'}});
    return [res1, res2];
  };
  
  const [
      { loading: isIdLoading, error: isIdError, data: idData },
      { loading, data, refetch }
  ] = queryMultiple();

  console.log(data);


  if (isIdLoading) return <p>loading...</p>;
  if (isIdError) return <p>Error :(</p>;

  return (
    <div className='h-screen p-2'>
        <div className='flex justify-around'>
          {
              idData?.histories?.map((i, index) => <Chip key={index} 
                                                        color={data.history?.id === i.id? 'info' : 'default'} 
                                                        label={i.id} 
                                                        onClick={() => refetch({id:i.id})}></Chip>)
          }
        </div>
        

        <Paper elevation={3} sx={{padding:4, margin:4, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          {
            loading? <CircularProgress/> : <>
                                            <h1 className='text-xl bold border-b-4 border-double border-zinc-600 mb-4 pb-1'>{data.history?.title}</h1>
                                            <p className='mb-2'>{timeFormatter(data.history?.event_date_utc)}</p>
                                            <p className='mb-2'>{data.history?.details}</p>
                                            <p className='mb-2'>{data.history?.flight?.mission_name}</p>
                                            <p>{data.history?.flight?.launch_success}</p>
                                          </>
          }
        </Paper>
    </div>
  )
}