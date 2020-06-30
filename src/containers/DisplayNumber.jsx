
import DisplayNumber from "../components/DisplayNumber";
import {connect} from 'react-redux';
function mapReduxStateToProps(state) {
  return {
    number: state.number
  }
}

export default connect(mapReduxStateToProps)(DisplayNumber);