import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';
import { loadQuizDetailRequest as loadQuizSaga } from 'modules/Quiz/redux/sagas';

import styles from './styles.css';

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
        <Helmet>
          <title>{`Animatedtest - ${quiz.question}`}</title>
          <meta name="description" content={quiz.question} />
        </Helmet>
        <div className={cx('jumbotron text-center', styles.quizContainer)}>
          <h2>{quiz.question}</h2>
          <p><FormattedMessage id="quiz.description" /></p>
        </div>
      </div>
    );
  }
}

Quiz.preload = (params) => ([
  [loadQuizSaga, { slug: params.slug }],
]);

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
