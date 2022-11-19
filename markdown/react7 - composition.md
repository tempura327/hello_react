# 目錄

- [目錄](#目錄)
  - [composition 與 繼承](#composition-與-繼承)
  - [children](#children)
  - [特別化](#特別化)
  - [組件當作props](#組件當作props)
  - [參考資料](#參考資料)
  
## composition 與 繼承

composition(組合)是指，將組件或JSX當作props傳給另一個組件，進而造出新的組件

inheritance(繼承)是指，class A是由class B衍生出來的，A可以使用B所有的功能、欄位，故可以A說是B的子class

React`官方推薦製作component時`，只使`用組合`而不用繼承，`因為`專案大、需求多變的情況下`繼承`可能`不夠彈性`(會繼承到多餘的功能)

## children

所有在組件中的內容，都會被以children prop的形式當作子組件傳入

對應的Vue寫法為slot

```js
class SimpleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() { 
    const color = this.props.color || 'blue';
    const skin = this.props.type === 'outline' ? `border-2 border-solid border-${color}-400 hover:bg-${color}-400 hover:text-white` : `text-white bg-${color}-600 hover:bg-${color}-800`;

    return (
      {/* 使用children prop將按鈕的字傳入，這相當於v-slot */}
      <button className={`rounded p-2 ${skin} ${this.props.class}`} onClick={this.props.click}>{this.props.children || 'save'}</button>
    );
  }
}
```  

```js
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.closeModal = this.closeModal.bind(this);
    this.save = this.save.bind(this);
  }

  closeModal(){
    const {title} = this.props;
    
    // 提升state
    // 使用props傳下來的方法，去呼叫Modal所在的父組件裡控制Modal開關的方法，以此setState()
    this.props.onModalClose(`${title[0].toUpperCase()}${title.slice(1, title.length)}`);
  }

  save(){
    if(this.props.onSaveClick){
      this.props.onSaveClick();
    }
  }

  render() { 
    const footerElement = (<footer className='flex'>
                            <SimpleButton color="gray" type="outline" class="ml-auto" click={this.closeModal}>cancel</SimpleButton>
                            <SimpleButton color="blue" class="ml-3" click={this.save}>save</SimpleButton>
                          </footer>);

    return (
      <div className={`bg-gray-800/50 w-full min-h-screen h-auto py-6 absolute top-0 left-0 flex items-center ${this.props.isModalShow || 'hidden'}`}>
        <div className='bg-white rounded w-1/2 p-4 mx-auto'>
          <header className='flex justify-between text-xl'>
            <span >{this.props.title}</span>

            <button className='bold hover:scale-150' onClick={this.closeModal}>×</button>
          </header>
  
          <hr className='my-2'/>
          
          <main>
            {/* 使用children prop將modal body傳入，這相當於v-slot */}
            {this.props.children}
          </main>
  
          <hr className='my-2'/>
  
          {/* 自訂一個modalFooter prop，將modal footer傳入 */}
          {this.props.modalFooter || footerElement}
        </div>
      </div>
    );
  }
}
```

用起來會像這樣

![](https://static.coderbridge.com/img/tempura327/feeec34dcd2c4ac79eb0023ad0c35a78.gif)

```js
class App extends Component {
  state = {
    isCatusShow: false,
    isLilacShow:false,
    isHydrangeaShow: false,
    lilacImages:[
      'https://images.unsplash.com/photo-1595681238340-3e1024c79cf5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      'https://images.unsplash.com/photo-1622891597799-17ac7f9ab6fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80',
      'https://images.unsplash.com/photo-1589186118523-34c03029a4b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
    ],
    counter:0,
    plantNames:['Catus', 'Lilac','Hydrangea'],
  };

  toggleModal = (variable) => {
    this.setState({
      [`is${variable}Show`]:!this.state[`is${variable}Show`],
    })    
  }  

  save = (msg) => {
    alert(msg);
  }

  add = () => {
    this.setState({
      counter:this.state.counter + 1 >2 ? 0 : this.state.counter + 1
    });
  }

  render(){
    const footer =  (<footer className='flex'>
                      <SimpleButton color="red" click={() => {this.save('delete button of hydrangea')}} class="ml-auto">delete</SimpleButton>
                    </footer>);

    return (
      <div>
        <div className='container'>
          <h1 className='text-2xl text-center mb-3'>this is APP.js</h1>
  
          {
            this.state.plantNames.map((name, index) => <SimpleButton key={`${name}-${index}`} color="blue" class={index === 0? '' : 'ml-3'} click={() => {this.toggleModal(name)}}>see {name}</SimpleButton>)
          }
        </div>
  
        <Modal title="Catus" isModalShow={this.state.isCatusShow} onModalClose={this.toggleModal}>
          <img src="https://images.unsplash.com/photo-1615402062376-6a4eb078137f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80" alt="" />
        </Modal>
  
        <Modal title="Lilac" isModalShow={this.state.isLilacShow} onModalClose={this.toggleModal} onSaveClick={this.add}>
          <div>
            <img src={this.state.lilacImages[this.state.counter]} alt="" className='mx-auto'/>
          </div>
        </Modal>

        <Modal title="Hydrangea" modalFooter={footer} isModalShow={this.state.isHydrangeaShow}  onModalClose={this.toggleModal}>
          <img src="https://images.unsplash.com/photo-1527945505182-b4c5cbc546a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" alt="" className='mb-3'/>
        </Modal>
      </div>
    );
  }
}

export default App;
```

## 特別化

特化是指某個組件是另一個通用組件的特殊型態的情況，可以使用composition來實現

例如有個TableModal就是Modal的特別化

```js
class TableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() { 
    const field = this.props.field;

    return (
      <Modal title={this.props.title} isModalShow={this.props.isModalShow} onModalClose={this.props.onModalClose}>
        <table className='border-2 border-solid border-gray-400 mx-auto'>
          <tbody>
            <tr>
              {
                field.map((field, index) => <th className='border-2 border-solid border-gray-400 p-2' key={`field-${index}`}>{field.label}</th>)
              }
            </tr>

            {
              this.props.data.map((data, index) => {
                return (<tr key={`row-${index}`}>
                          {field.map((field, index2) => <td className='border-2 border-solid border-gray-400 p-2' key={`${index}-${index2}`}>{data[field.key]}</td>)}
                        </tr>);
              })
            }
          </tbody>
        </table>
      </Modal>
    );
  }
}
```

用起來會像這樣

![](https://static.coderbridge.com/img/tempura327/8c689401b13a4c7187b440a656dc17af.gif)

```js
class App extends Component {
  state = {
    isTableShow: false,
    tableData:[{id:1, name:'Alex', English:99, Math:78}, {id:2, name:'Emma', English: 88, Math:89}, {id:3, name:'Joy', English:76, Math:65}],
    tableField:[{key:'id', label:'座號'},{key:'name', label:'姓名'},{key:'English', label:'英文'},{key:'Math', label:'數學'}],
  };

  toggleModal = (variable) => {
    this.setState({
      [`is${variable}Show`]:!this.state[`is${variable}Show`],
    })    
  }  

  render(){
    const footer =  (<footer className='flex'>
                      <SimpleButton color="red" click={() => {this.save('delete button of hydrangea')}} class="ml-auto">delete</SimpleButton>
                    </footer>);

    return (
      <div>
        <div className='container'>
          <h1 className='text-2xl text-center mb-3'>this is APP.js</h1>

          <SimpleButton color="blue" click={() => {this.toggleModal('Table')}}>see Table</SimpleButton>
        </div>

        <TableModal title="table" field={this.state.tableField} data={this.state.tableData} isModalShow={this.state.isTableShow} onModalClose={this.toggleModal}></TableModal>
      </div>
    );
  }
}

export default App;
```

## 組件當作props

(11/9更新)

假設要做個網站，每個頁面都會出現nav、footer，nav內的右側有一個使用者頭像，點擊會連到使用者頁面

結構如下

App
└── Page
    └── PageLayout
            ├── NavigationBar
            │        └──Link
            │            └──Avatar
            │
            ├── 內容(children prop)
            └── footer

不使用composition的話，資料會從App → Page → PageLayout → NavigationBar → Link → Avatar

如果使用的話資料會從App → Page，Page直接組裝Link + Avatar，然後⇒PageLayout⇒NavigationBar

完整步驟如下

App先抓資料，然後傳給Page(App → Page)

```js
// App.js
import Page from './components/Page';

function App(){
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async() => {
      await fetch('https://api.github.com/users/tempura327', {
        method:'GET'
      }).then(async(d) => setUserData(await d.json()));
    }

    getUserData();
  }, [])

  return (
    <div className='w-full'>
      {/* 把使用者資料傳給Page */}
      <Page user={userData} avatarStyle='w-14 h-14'>
        {/* 頁面內容 */}
        <h1 className='text-2xl font-bold text-center my-4'>ApolloTimeline</h1>
        <ApolloTimeline></ApolloTimeline>
      </Page>
    </div>
  );
}
```

Page收到資料後，`抽出需要的部分寫成JSX`賦值給變數(Page直接組裝Link)

再將它`傳給PageLayout`(⇒PageLayout)

```js
// Page.js

import Link from './Link';
import Avatar from './Avatar';
import PageLayout from './PageLayout';

function Page(props) {
  const user = props.user;

  const userLink = (
    <Link href={user.html_url} className='ml-auto'>
      <Avatar imgUrl={user.avatar_url} className={`${props.avatarStyle}`} />
    </Link>
  );
  
  return (
    <PageLayout userLink={userLink}>
      {/* 從App傳入的頁面內容 */}
      {props.children}
    </PageLayout>
  );
}
```

PageLayout收到JSX後，傳給NavigationBar(⇒NavigationBar)

```js
// PageLayout.js

function PageLayout({userLink, children}){
  return (
    <>
      {/* 從Page傳入的userLink(Link內包了Avatar) */}
      <NavigationBar userLink={userLink}></NavigationBar>
      {/* 從Page傳入的頁面內容 */}
      {children}
      <footer className='bg-zinc-600 p-2 px-12 text-center text-white'>Copyright © 2022 Tempura327</footer>
    </>
  );
}
```

NavigationBar收到JSX，擺到需要該JSX的位置

```js
// NavigationBar.js

function NavigationBar({userLink}){
  return (
    <div className='bg-zinc-600 p-2 px-12 flex'>
      {userLink}
    </div>
  );
}
```

## 參考資料

[React - Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)  
[I Want To Know React - Composition vs Inheritance](https://ithelp.ithome.com.tw/articles/10251762)