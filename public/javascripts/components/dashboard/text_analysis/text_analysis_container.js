import {createTask} from '../../../actions/task_actions';
import { clearErrors } from "../../../actions/error_actions";
import { connect } from 'react-redux';
import TextAnalysis from './text_analysis';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  errors: state.errors
})

const mapDispatchToProps = dispatch => ({
  createTask: task => dispatch(createTask(task)),
  clearErrors: () => dispatch(clearErrors())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextAnalysis);