# 필기노트

## Redux 란?

![1_kruPynfRlo9J-JoWUV5LDQ](https://user-images.githubusercontent.com/32591477/85845799-ce014080-b7df-11ea-90a2-1bf1cf02eaa2.png)
`

Redux는 수많은 데이터의 흐름을 `Store`라는 커다란 단위를 통해 **집중관리** 한다.

* 데이터 중앙관리가 없을때의 데이터의 흐름은 컴포넌트 간 데이터를 주고받는 **소문** 과도 같다.
* 데이터 중앙관리가 있을때의 데이터의 흐름은 이미지와 같이 `Store`가 각 컴포넌트에 전파한다. **방송국** 이 존재하는것과 같다.

### Redux가 없는 React

[Rudux 없는 React - 컴포넌트 구조 만들기](https://github.com/kjkandrea/egoing-react-redux/tree/57f7d72c866e98d2d7abc1faa342bd551266f409)

![스크린샷 2020-06-26 오후 7 11 57](https://user-images.githubusercontent.com/32591477/85847010-b4f98f00-b7e1-11ea-8da5-88afa0dcf91a.png)

이미지와 같은 컴포넌트들로 구성된 구조에서 `AddNumber` 컴포넌트에서 발생한 이벤트를 `DisplayNumber` 에 까지 전달하여 반영하려 한다.

```
Root/
--| AddNumberRoot/
-----| AddNumber

--| DisplayNumberRoot/
-----| DisplayNumber
```

리덕스가 없는 상황에서 이벤트를 전파하려면 다음과 같은 **5단계의** 이벤트 버블링(event bubbling)을 거친다.

#### 1. AddNumber

`AddNumber` 컴포넌트에서 이벤트를 발생시켜 `onClick`을 다음과 같이 이벤트 버블링으로 넘겨준다.

``` jsx
// AddNumber.jsx

import React, {Component} from 'react';
export default class AddNumber extends Component {
    state = {
      size: 1
    }

    render() {
      return (
        <div>
          <h1>Add Number</h1>
          <input 
            type="button"
            value="+"
            onClick={
              () => this.props.onClick(this.state.size) // 클릭이벤트가 발생했을때 props로 onClick 이벤트를 넘겨줌
            }
          />
          <input 
            type="text"
            value={this.state.size}
            onChange={
              e => this.setState({size: Number(e.target.value)})
            }
          />
        </div>
      )
    }
  }
```

#### 2. AddNumberRoot

`AddNumberRoot`에서 `onClick`을 `Root`에 이벤트 버블링으로 넘겨준다.

``` jsx
// AddNumberRoot.jsx

import React, {Component} from "react";
import AddNumber from "../components/AddNumber";
export default class AddNumberRoot extends Component{
    render(){
      return (
        <div>
          <h1>Add Number Root</h1>
          <AddNumber
            onClick={
              size => this.props.onClick(size)
            }
          />
        </div> 
      )
    }
  }
```

#### 3. Root

* `Root` 에서 `AddNumber` 로 부터 올라온 값을 `state.number`에 더한다.
* `state.number` 값을 `DisplayNumberRoot`에게 props로 넘겨준다.

``` jsx
// App.js

import React, {Component} from 'react';
import './App.css';
import AddNumberRoot from "./components/AddNumberRoot";
import DisplayNumberRoot from "./components/DisplayNumberRoot";

class App extends Component {
  state = {
    number: 0
  }
  render() {
    return (
      <div className="App">
        <h1>Root</h1>
        <AddNumberRoot
          onClick={
            size => this.setState({
              number : this.state.number + size
            })
          }
        />
        <DisplayNumberRoot number={this.state.number}/>
      </div>
    );
  }
}

export default App;
```

#### 4. DisplayNumberRoot

`Root`에서 받아온 `props.number`를 `DisplayNumber`에게 내려보내준다.

``` jsx
// DisplayNumberRoot.jsx

import React, {Component} from "react";
import DisplayNumber from "../components/DisplayNumber";

export default class DisplayNumberRoot extends Component{
    render(){
      return (
        <div>
          <h1>Display Number Root</h1>
          <DisplayNumber number={this.props.number}/>
        </div>
      )
    }
  }
```

#### 5. DisplayNumber

비로소 `props.number`로 받아온 값을 `DisplayNumber`에서 표시한다.

``` jsx
// DisplayNumber.jsx

import React, {Component} from "react";

export default class DisplayNumber extends Component {
    render() {
      return (
        <div>
          <h1>Display Number</h1>
          <input type="text" value={this.props.number} readOnly/>
        </div>
      )
    }
  }
```

#### 무엇이 불편한가?

각각의 컴포넌트들을 `props` 로 연결하여 뎁스별로 아주 긴 연결을 거쳐야한다. 컴포넌트 뎁스가 예제보다 긴 상황이라면 피로한 작업이 될 것이다.
또한 `props`가 전파되며 체인에 연결된 모든 컴포넌트를 호출하여 성능에 좋지않은 영향을 준다.

## Redux

### Redux 인스톨

다음 명령어로 인스톨한다.

```
npm install redux
```

### Redux DevTools 인스톨 및 세팅

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related) 확장 프로그램을 chrome에 인스톨 한다.

`store.js`에서 다음과 같은 구문을 마지막 인자로 넘겨준다.

`window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()`

``` javascript
import {createStore} from 'redux';

export default createStore(
  function(state, action) { // Reducer
    return state;
  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
```

### Redux로 대이터 관리하기

Redux가 없을 때에 체인으로 주고받았던 `number` 값을 이제 store.js에서 관리하도록 한다.

#### 1. Store 세팅

``` javascript 
// store.js

import {createStore} from 'redux';

export default createStore(
  function(state, action) { // Reducer
    if(state === undefined){ // state가 비었을때
      return {number: 0} // number 프로퍼티 생성
    }
    if(action.type === 'INCREMENT'){ // INCREMENT action이 발생했을 때
      return {...state, number:state.number + action.size} // action을 통해 전달된 size를 number 값에 더한다.
    }

    return state;
  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
)
```

#### 2. AddNumber에서 Store 호출

`AddNumber` 컴포넌트에서 클릭 이벤트 발생 시 `INCREMENT`란 이름으로 Store에 size를 넘겨준다. 

``` jsx
// AddNumber.jsx

import React, {Component} from 'react';
import store from '../store';

export default class AddNumber extends Component {
  state = {
    size: 1
  }

  render() {
    return (
      <div>
        <h1>Add Number</h1>
        <input 
          type="button"
          value="+"
          onClick={
            () => {
              store.dispatch({type:'INCREMENT', size: this.state.size}) // INCREMENT란 이름으로 size를 store에 전달
            }
          }
        />
        <input 
          type="text"
          value={this.state.size}
          onChange={
            e => this.setState({size: Number(e.target.value)})
          }
        />
      </div>
    )
  }
}
```

#### 3. DisplayNumber에서 store.number 표시

``` javascript
// DisplayNumber.jsx

import React, {Component} from "react";
import store from "../store";

export default class DisplayNumber extends Component {
  state = {
    number: store.getState().number
  }
  
  constructor(props){
    super(props);
    store.subscribe(() => {
      this.setState({number: store.getState().number});
    })
  }
  
  render() {
    return (
      <div>
        <h1>Display Number</h1>
        <input type="text" value={this.state.number} readOnly/>
      </div>
    )
  }
}
```

### react 컴포넌트에서 redux에 종속된 기능을 제거

`Components/AddNumber.jsx` 는 자신의 기능을 수행하나, 현재 코드를 개선하여 부품으로써의 가치를 부여해줄 수 있다. 현재는 redux에 전적으로 의존하는 컴포넌트이나 `랩핑` 이라는 방법을 사용하여 종속성을 제거해보자.

#### 콘텐츠 랩핑

방법은 `Containers/AddNumber` 라는 일종의 `래퍼`를 `AddNumberRoot`와 `AddNumber`사이에 끼워넣어 Redux의 state를 중개하는 역할을 하게하는 것이다.

```
--| AddNumberRoot/
----| Containers/AddNumber
------| AddNumber
```

#### 랩핑하기

src 디렉토리에 `Containers/AddNumber.jsx` 파일을 추가한 후 다음과 같이 AddNumber를 출력하도록 만들어준다.

``` jsx
// Containers/AddNumber.jsx
import AddNumber from "../components/AddNumber";
import React, { Component } from "react";

export default class extends Component {
  render(){
    return <AddNumber />
  }
}
```

그 후 `AddNumberRoot` 컴포넌트에서 `AddNumber Component` 대신 `AddNumber Container` 를 읽어들여 표시한다.

``` jsx
// AddNumberRoot.jsx
import AddNumber from "../containers/AddNumber";
```

이제 `Containers/AddNumber.jsx` 에서 Redux의 state를 중개하도록 변경하여보자.

#### Redux state 중개하기

`Components/AddNumber.jsx` 가 직접 소통하던 `store.dispatch` 구문을 다음과 같이 수정하여 이벤트버블링으로 `Containers/AddNumber.jsx` 로 넘겨준다.

``` jsx
import React, {Component} from 'react';

export default class AddNumber extends Component {
  state = {
    size: 1
  }

  render() {
    return (
      <div>
        <h1>Add Number</h1>
        <input 
          type="button"
          value="+"
          onClick={
            () => {
              this.props.onClick(this.state.size)
            }
          }
        />

... // 아래부분은 생략
```

`Containers/AddNumber.jsx` 가 리덕스와 상호작용하도록 변경하자.

``` jsx
// Containers/AddNumber.jsx
import AddNumber from "../components/AddNumber";
import React, { Component } from "react";
import store from '../store';

export default class extends Component {
  render(){
    return (
      <AddNumber 
        onClick={
          (size) => store.dispatch({type:'INCREMENT', size: size})
        } 
      />
    )
  }
}
```

##### 변경된 점

`Container/AddNumber.jsx`가 리덕스 없이도 재사용 가능한 **부품으로서의 가치가 있는 완전한 프레젠테이션 컴포넌트**가 되었다.

### React와 Redux

리엑트와 리덕스를 조합하는것은 데이터 전달을 효율적으로 바꾸어주는 성취가 있었다.
허나 리엑트와 리덕스를 콜라보하는 과정에서 콘테이너를 만든 작업, dispatch 등 많은 일이 수반된다.
`React-Redux`를 사용하여 이 작업을 보다 쉽게 할 수 있다.

## React-Redux

### 설치

```
npm install react-redux
```

### Provider

react로 작성된 컴포넌트들을 `Provider`안에 넣으면 하위 컴포넌트들이 `Provider`를 통해 redux store에 접근이 가능해진다.

`index.js`에서 다음과 같이 `Provider` 를 import해 `<App/>`을 감싸주자.

``` jsx
//index.js
import { Provider } from 'react-redux';
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### AddNumber container 리펙터링

`Container/AddNumber.jsx`를 다음과 같이 변경하여준다.

``` jsx
import AddNumber from "../components/AddNumber";
import {connect} from 'react-redux';
export default connect()(AddNumber);
```

이게 끝이다. 기존의 장황했던 코드들을 `export default connect()(AddNumber);` 로 대체한다. 어떻게 이렇게 마법같은 일이 일어날까?

[기존의 코드가 궁금하다면](https://github.com/kjkandrea/egoing-react-redux/blob/react-with-redux/src/containers/AddNumber.jsx)

### connect 함수의 원형 엿보기

 [gaearon/connect.js](https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e)
 리덕스의 저자 gaearon 의 레포지토리에서 `connect()()`의 원형 `connect.js` 를 엿볼 수 있다.

``` jsx
// connect() 는 Redux와 연관된 props를 component에 삽입하는 함수입니다.
// dispatch actions을 통해 data를 변경하는 data나 Callback를 삽입할 수 있습니다.
function connect(mapStateToProps, mapDispatchToProps) {
  // It lets us inject component as the last step so people can use it as a decorator.
  // Generally you don't need to worry about it.
  return function (WrappedComponent) {
    // component를 return
    return class extends React.Component {
      render() {
        return (
          // 여기서 컴포넌트가 렌더링 된다.
          <WrappedComponent
            {/* with its props  */}
            {...this.props}
            {/* Redux store 에서 계산된 props */}
            {...mapStateToProps(store.getState(), this.props)}
            {...mapDispatchToProps(store.dispatch, this.props)}
          />
        )
      }
      
      componentDidMount() {
        // 업데이트를 놓치지않도록 store를 구독해야 합니다.
        this.unsubscribe = store.subscribe(this.handleChange.bind(this))
      }
      
      componentWillUnmount() {
        // 미지막에 구독 취소
        this.unsubscribe()
      }
    
      handleChange() {
        // store 가 변경될 때마다 다시 렌더링 됩니다.
        this.forceUpdate()
      }
    }
  }
}

// 예시

// The purpose of connect() is that you don't have to think about
// subscribing to the store or perf optimizations yourself, and
// instead you can specify how to get props based on Redux store state:

const ConnectedCounter = connect(
  // Given Redux state, return props
  state => ({
    value: state.counter,
  }),
  // Given Redux dispatch, return callback props
  dispatch => ({
    onIncrement() {
      dispatch({ type: 'INCREMENT' })
    }
  })
)(Counter)
```

`connect.js` 의 첫번째 리턴값은 함수이며, 두번째 인자로 `WrappedComponent`를 넘겨주어 인자로 받은 컴포넌트를 리턴한다.

props를 넘겨받아 넘겨주는것 또한 처리해준다.

### connect(?)(component) : ?는 무엇인가

`connect(?)(component)`의 ? 부분에는 두개의 인자가 들어간다.

1. mapStateToProps
2. mapDispatchToProps

[Connect: Extracting Data with mapStateToProps](https://react-redux.js.org/using-react-redux/connect-mapstate)

[Connect: Dispatching Actions with mapDispatchToProps](https://react-redux.js.org/using-react-redux/connect-mapdispatch)

#### mapStateToProps 개념 이해

`mapStateToProps`는 connect함수에 첫번째 인수로 들어가는 함수 혹은 객체 이다.

* store가 업데이트가 될때 마다 자동적으로 호출이 된다
* 이를 원하지 않는다면 null 혹은 undefined값을 제공해야한다.

#### mapDispatchToProps 개념 이해

`mapDispatchToProps`는 connect함수의 두번째 인자로 사용된다.
store에 접근한 컴포넌트가 store의 상태를 바꾸기 위해
**dispatch를 사용할수 있게 만들어준다.**

#### 시작

mapStateToProps, mapDispatchToProps는 햇갈릴 수 있는 네이밍이기에 각 `mapReduxStateToProps`, `mapReduxDispatchToReactProps` 로 변경해주고 다음과 같이 인자로 넘겨주어보자.

``` jsx
// containers/DisplayNumber.jsx

function mapReduxStateToProps(state) {}
function mapReduxDispatchToReactProps() {}

export default connect(mapReduxStateToProps, mapReduxDispatchToReactProps)(DisplayNumber);
```

##### mapReduxStateToProps에 인자 number 전달하기

다음과 같이 `mapReduxStateToProps`를 통해 number를 전달하여 connect(?)()의 **?** 부분에 첫번째 인자로 전달한다.

``` jsx
// containers/DisplayNumber.jsx

import DisplayNumber from "../components/DisplayNumber";
import {connect} from 'react-redux';
function mapReduxStateToProps(state) {
  return {
    number: state.number
  }
}

export default connect(mapReduxStateToProps)(DisplayNumber);
```

`containers/DisplayNumber.jsx`의 connect(?)의 두번째인자는 공급해줄 필요가 없기때문에 DisplayNumber의 수정은 완료되었다.

##### mapReduxDispatchToReactProps에 이벤트와 dispatch 전달하기

`containers/AddNumber.jsx`에서 다음과같이 구현한다.

``` jsx
// containers/AddNumber.jsx

import AddNumber from "../components/AddNumber";
import {connect} from 'react-redux';
function mapReduxDispatchToReactProps(dispatch) {
  return {
    onClick: (size) => dispatch({type:'INCREMENT', size:size})
  }
}
export default connect(null, mapReduxDispatchToReactProps)(AddNumber);
```

### 내맘대로 추가 과제 : DECREMENT 만들어보기

추가로 `DECREMENT` 기능을 구현해보았다

[브랜치 바로가기](https://github.com/kjkandrea/egoing-react-redux/tree/react-redux-extends)