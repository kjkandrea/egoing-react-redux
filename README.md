# 필기노트

## React Redux

![1_kruPynfRlo9J-JoWUV5LDQ](https://user-images.githubusercontent.com/32591477/85845799-ce014080-b7df-11ea-90a2-1bf1cf02eaa2.png)
`

React Redux는 수많은 데이터의 흐름을 `Store`라는 커다란 단위를 통해 **집중관리** 한다.

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