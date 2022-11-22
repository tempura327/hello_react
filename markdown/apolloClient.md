# 目錄

- [目錄](#目錄)
  - [Apollo client是甚麼](#apollo-client是甚麼)
  - [基本使用](#基本使用)
  - [refetch & variable](#refetch--variable)
  - [參考資料](#參考資料)

## Apollo client是甚麼

Apollo client是一個狀態管理用的package，常用於前端為React，後端為GraphQL的專案

透過它可以和本地、遠端的GraphQL API互動

前一篇提到的`GraphQL cache`問題也`可`以透過它`處理`

## 基本使用

1. 安裝

```bash
npm i @apollo/client

// 用於解析GraphQL的query
npm i graphql
```

2. 初始化Apollo client

<!-- DocumentNode??? -->

```js
// ApolloClient用於建立連線
// InMemoryCache用於快取住fetch下來的資料
// ApolloProvider是用於包裹React app的組件
// gql是一個函式，參數是query string
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// 建立連線
const client = new ApolloClient({
  uri: 'https://flyby-gateway.herokuapp.com/', // API網址
  cache: new InMemoryCache(),
});
```

1. query

```js
client.query({
    query:gql`{
        locations {
            photo
            name
        } 
    }`
}).then(d => console.log(d)); 
// 打開dev tool就能看到撈出來的資料
```

4. 把client用到React

使用ApolloProvider組件，可以連接Apollo client和React，其功能類似React的Context.Provider

使用ApolloProvider後它會取代context，在它底下的組件都可以連到Apollo client，因此官方推薦把它放在index.js

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App'; 

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://flyby-gateway.herokuapp.com/', // API網址
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
```

5. 使用useQuery撈資料

useQuery是一個React hook，它會回傳loading、error狀態、撈出來的資料

`Apollo client撈到資料`後會自動把它`快取`住，這樣下次撈同樣的資料時就會`更快`

![](https://static.coderbridge.com/img/tempura327/9aa647ea5a5b4230a1ef63421f9c5d8b.gif)

```js
// ApolloTimeline.js

import { useQuery, gql } from '@apollo/client';

export default function ApolloTimeline(props){
  const { loading, error, data } = useQuery(gql`
    {
      histories(sort: "event_date_utc") {
        event_date_utc
        title
        details
        flight {
          launch_success
        }          
      }
    }
  `);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Timeline position="alternate">
        {
          data.histories.map((i, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>{timeFormatter(i.event_date_utc)}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                {index === data.histories.length - 1? null : <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Chip label={i.title} color={i.flight?.launch_success? 'success' : 'default'}></Chip>
              </TimelineContent>
            </TimelineItem>
          ))
        }
      </Timeline>
    </div>
  )
}
```

## refetch & variable

refetch常用於根據使用者的動作撈資料的情況

![](https://static.coderbridge.com/img/tempura327/668f42cb7105439fa68a5d5a401beaf6.gif)

```js
// ApolloRefetch.js

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
```

## 參考資料

[Get started with Apollo Client](https://www.apollographql.com/docs/react/get-started)  
[Apollo client - Queries](https://www.apollographql.com/docs/react/data/queries/)  
[Refetching queries in Apollo Client](https://www.apollographql.com/docs/react/data/refetching/)
[Cleaning Unwanted Fields From GraphQL Responses](https://stackoverflow.com/questions/47211778/cleaning-unwanted-fields-from-graphql-responses/51380645#51380645)  

playground

[FlyBy GraphQL API](https://studio.apollographql.com/sandbox/explorer)