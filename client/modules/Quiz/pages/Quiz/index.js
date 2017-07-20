import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';
import { loadQuizDetailRequest as loadQuizSaga } from 'modules/Quiz/redux/sagas';
import FacebookButton from 'modules/Quiz/components/FacebookButton';
import getQuizLocale from 'modules/Intl/utils/getQuizLocale';

import styles from './styles.css';

class Quiz extends Component {
  componentWillMount() {
    this.props.loadQuizDetailRequest(this.props.params.slug);
  }

  render() {
    const { quizDetail, currentSlug, lang } = this.props;
    if (!currentSlug || !quizDetail) {
      return null;
    }
    const quiz = this.props.quizDetail.toJS();
    const locale = getQuizLocale(quiz, lang);

    return (
      <div className="container">
        <Helmet>
          <title>{`Animatedtest - ${locale.question}`}</title>
          <meta name="description" content={locale.question} />
        </Helmet>
        <div className={cx('jumbotron text-center', styles.quizContainer)}>
          <h2>{locale.question}</h2>
          <div className={styles.imgContainer}>
            <img className="img-responsive" src={quiz.titleImage} alt={locale.question} />
          </div>
          <p><FormattedMessage id="quiz.description" /></p>
          <FacebookButton />
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
  lang: PropTypes.string.isRequired,
  currentSlug: PropTypes.string.isRequired,
  loadQuizDetailRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  quizDetail: selectors.selectQuizDetail(state),
  lang: selectors.selectCurrentLocale(state),
  currentSlug: selectors.selectSlug(state),
});

const mapDispatchToProps = {
  loadQuizDetailRequest: actions.loadQuizDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(Quiz);
