
import DisplayNumber from "../components/DisplayNumber";
import {connect} from 'react-redux';
function mapReduxStateToProps(state) {
  return {
    number: this.state.number
  }
}
function mapReduxDispatchToReactProps() {}

export default connect(mapReduxStateToProps, mapReduxDispatchToReactProps)(DisplayNumber);