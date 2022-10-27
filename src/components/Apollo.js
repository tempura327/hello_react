import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';

const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache(),
});

export default function Apollo(props){
	let [isLoading, setIsLoading] = useState(true);
	let [data, setData] = useState(true);

	useEffect(() => {
		client
		.query({
	  	query: gql`
	      {
	        capsules {
	          id
	          missions {
	            flight
	            name
	          }
			  status
	        }
	      }
	    `,
	  }).then((result) => {
	  	setData(result.data.capsules);
	  	setIsLoading(result.loading);	
	  });	
	}, [isLoading])
  
  return (
      <ApolloProvider  client={client}>
          <p className='text-2xl mb-3'>Capsules List</p>
          {
            isLoading? <CircularProgress /> : <Table>
												<TableHead>
													<TableRow>
														<TableCell>id</TableCell>
														<TableCell>mission</TableCell>
													</TableRow>
												</TableHead>
												
												<TableBody>
													{data.map((d, index) => <TableRow key={index}>
																				<TableCell>{d.id}</TableCell>
																				<TableCell>
																					{
																						d.missions.map(item => <Chip 
																										key={item.name} 
																										color={d.status === 'active' ? 'success' : 'default'} 
																										className='mr-2'  
																										label={`${item.flight}/${item.name}`}/>)
																					}
																				</TableCell>
																			</TableRow>
													)}
												</TableBody>
											</Table>
          }
      </ApolloProvider>        
  )
}