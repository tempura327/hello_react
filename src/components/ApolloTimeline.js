import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function timeFormatter(str){
  if(!str) return '';
  return str.replace(/T|Z/g, ' ');
}

export default function ApolloTimeline(props){
  const [id, setId] = useState('');
  const [allHistories, setAllHistories] = useState([]);
  const [historyDetail, setHistoryDetail] = useState({});
  const [isModalShow, setIsModalShow] = useState(false);

  const allHistoriesQL = gql`
  {
    histories(sort: "event_date_utc") {
      id
      event_date_utc
      title
      details
      flight {
        launch_success
      }          
    }
  }
`;

  const historyQL = gql`
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
  `;

  const { loading, error, data } = useQuery(id? historyQL : allHistoriesQL, {variables:{id:id}});

  const getDetail = (id) => {
    setId(id);

    setIsModalShow(true);
  }

  useEffect(() => {
    if(data !== undefined && data.histories){
      setAllHistories(data.histories);
    }

    if(data !== undefined && data.history){
      setHistoryDetail(data.history);
      console.log(historyDetail);
    }
    
  }, [loading]);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
        <Modal open={isModalShow} className="flex justify-center items-center" onClose={() => {setIsModalShow(false)}}>
          <Box sx={{width:700, backgroundColor:'white', margin:'0 auto', padding:8, borderRadius:4}}>
            <h1 className='text-xl bold mb-4'>{historyDetail.title}</h1>

            <ul>
              <li className='mb-2'>Date: {timeFormatter(historyDetail?.event_date_utc)}</li>
              <li className='mb-2'>Detail: {historyDetail.details}</li>
              <li className='mb-2'>Mission Name: {historyDetail.flight?.mission_name}</li>
              <li>Success: {JSON.stringify(historyDetail.flight?.launch_success)}</li>
            </ul>
          </Box>
        </Modal>

        <Timeline position="alternate">
          {
            allHistories.map((i, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>{timeFormatter(i.event_date_utc)}</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  {index === allHistories.length - 1? null : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Chip label={i.title} 
                        color={i.flight?.launch_success? 'success' : 'default'}
                        onClick={() => {getDetail(i.id)}}
                        />
                </TimelineContent>
              </TimelineItem>
            ))
          }
        </Timeline>
    </div>
  )
}