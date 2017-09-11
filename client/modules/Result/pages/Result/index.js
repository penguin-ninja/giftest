import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import selectors from 'modules/Result/redux/selectors';
import actions from 'modules/Result/redux/actions';
import FacebookShareButton from 'modules/Result/components/FacebookShareButton';
import { loadResultRequest as loadResultSaga } from 'modules/Result/redux/sagas';
import getQuizLocale from 'modules/Intl/utils/getQuizLocale';

import styles from './styles.css';
import loader from './loader.gif';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = { showAnalyze: true };
  }

  componentWillMount() {
    if (this.props.query && this.props.query.share && this.props.result && this.props.result.get('quiz')) {
      this.props.dispatch(replace(`/quiz/${this.props.result.get('quiz').get('_id')}`));
      return;
    }

    this.props.loadResultRequest(this.props.params.resultId);
    setTimeout(() => {
      this.setState({ showAnalyze: false });
    }, 3000);
  }

  _renderResult = (result, locale) => {
    return (
      <div className={cx('jumbotron text-center', styles.resultContainer)}>
        <FacebookShareButton />
        <h2>{locale.question}</h2>
        <div className={styles.imgContainer}>
          <img className={cx('img-responsive', styles.image)} src={result.image} alt={result.quiz.question} />
          <FacebookShareButton />
        </div>
      </div>
    );
  }

  _renderLoading = () => {
    return (
      <div className={cx('jumbotron text-center', styles.resultContainer)}>
        <img src={loader} alt="loading" className={styles.loading} />
        <h3><FormattedMessage id={this.state.showAnalyze ? 'result.analyzing' : 'result.calculating'} /></h3>
      </div>
    );
  }

  render() {
    const { result: resultImmutable, lang } = this.props;
    if (!resultImmutable) {
      return <div>Loading...</div>;
    }

    const result = resultImmutable.toJS();
    const image = result.image || `${process.env.AWS_S3_URL}/${process.env.AWS_S3_FOLDER}/${result._id}.gif`;
    const locale = getQuizLocale(result.quiz, lang);

    return (
      <div className="container">
        <Helmet>
          <title>{`Animatedtest - ${result.user.firstName}'s Result`}</title>
          <meta name="description" content={locale.question} />
          <meta property="og:url" content={image} />
          <meta property="og:title" content={locale.question} />
          <meta property="og:description" content={locale.question} />
          <meta property="og:type" content="video.other" />
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="372" />
        </Helmet>
        {
          result.image ?
            this._renderResult(result, locale) :
            this._renderLoading()
        }
      </div>
    );
  }
}

Result.preload = (params) => ([
  [loadResultSaga, { resultId: params.resultId }],
]);

Result.propTypes = {
  params: PropTypes.object.isRequired,
  result: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  loadResultRequest: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  generateResultRequest: PropTypes.func.isRequired,
  query: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  result: selectors.selectResult(state),
  loading: selectors.selectLoading(state),
  lang: selectors.selectCurrentLocale(state),
  path: selectors.selectPath(state),
  query: selectors.selectQuery(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    loadResultRequest: (...args) => dispatch(actions.loadResultRequest(...args)),
    generateResultRequest: (...args) => dispatch(actions.generateResultRequest(...args)),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(Result);
