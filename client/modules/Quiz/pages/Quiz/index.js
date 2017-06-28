import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';

class Quiz extends Component {
  componentWillMount() {
    this.props.loadQuizDetailRequest(this.props.params.slug);
  }

  render() {
    const { quizDetail, currentSlug } = this.props;
    if (!currentSlug || !quizDetail) {
      return null;
    }
    const quiz = this.props.quizDetail.toJS();

    return (
      <div className="container">
        {quiz.question}
      </div>
    );
  }
}

Quiz.propTypes = {
  params: PropTypes.object.isRequired,
  quizDetail: PropTypes.any.isRequired,
  currentSlug: PropTypes.string.isRequired,
  loadQuizDetailRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  quizDetail: selectors.selectQuizDetail(state),
  currentSlug: selectors.selectSlug(state),
});

const mapDispatchToProps = {
  loadQuizDetailRequest: actions.loadQuizDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(Quiz);
