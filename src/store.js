import {createStore} from 'redux';

export default createStore(
  function(state, action) { // Reducer
    if(state === undefined){
      return {number: 0}
    }
    
    if(action.type === 'INCREMENT'){
      return {...state, number:state.number + action.size}
    }

    if(action.type === 'DECREMENT'){
      return {...state, number:state.number - action.size}
    }

    return state;
  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)