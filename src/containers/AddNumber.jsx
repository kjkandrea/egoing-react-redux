import AddNumber from "../components/AddNumber";
import {connect} from 'react-redux';
function mapReduxDispatchToReactProps(dispatch) {
  return {
    onClickPlus: size => dispatch({type:'INCREMENT', size:size}),
    onClickMinus: size => dispatch({type:'DECREMENT', size:size})
  }
}
export default connect(null, mapReduxDispatchToReactProps)(AddNumber);