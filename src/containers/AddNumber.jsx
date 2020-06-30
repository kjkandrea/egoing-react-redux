import AddNumber from "../components/AddNumber";
import {connect} from 'react-redux';
function mapReduxDispatchToReactProps(dispatch) {
  return {
    onClick: size => dispatch({type:'INCREMENT', size:size})
  }
}
export default connect(null, mapReduxDispatchToReactProps)(AddNumber);