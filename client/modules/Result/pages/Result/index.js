import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Helmet from 'react-helmet';
import ua from 'isomorphic-user-agent';
import selectors from 'modules/Result/redux/selectors';
import actions from 'modules/Result/redux/actions';
import FacebookShareButton from 'modules/Result/components/FacebookShareButton';
import { loadResultRequest as loadResultSaga } from 'modules/Result/redux/sagas';

import styles from './styles.css';

class Result extends Component {
  componentWillMount() {
    this.props.loadResultRequest(this.props.params.resultId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.result) {
      const image = nextProps.result && nextProps.result.get('image');
      if (!image && !this.props.loading) {
        this.props.generateResultRequest(this.props.params.resultId);
      }
    }
  }

  _renderResult = (result) => {
    return (
      <div className={styles.imgContainer}>
        <img className={cx('img-responsive', styles.image)} src={result.image} alt={result.quiz.question} />
        <FacebookShareButton />
      </div>
    );
  }

  render() {
    const { result: resultImmutable, path } = this.props;
    if (!resultImmutable) {
      return <div>Loading...</div>;
    }

    const result = resultImmutable.toJS();
    const image = result.image || `${process.env.AWS_S3_URL}/${process.env.AWS_S3_FOLDER}/${result._id}.gif`;
    const userAgent = ua().toLowerCase();
    let ogUrl = `${process.env.SITE_URL}${path}`;
    console.log(userAgent);
    if (userAgent.indexOf('facebookexternalhit') > -1 || userAgent.indexOf('facebot') > -1) {
      ogUrl = image;
    }

    return (
      <div className="container">
        <Helmet>
          <title>{`Animatedtest - ${result.user.firstName}'s Result`}</title>
          <meta name="description" content={result.quiz.question} />
          <meta property="og:url" content={ogUrl} />
          <meta property="og:title" content={result.quiz.question} />
          <meta property="og:description" content={result.quiz.question} />
          <meta property="og:type" content="article" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image" content={image} />
        </Helmet>
        <div className={cx('jumbotron text-center', styles.resultContainer)}>
          <h2>{result.quiz.question}</h2>
          {
            result.image ?
              this._renderResult(result) :
              <h3>Calculating result...</h3>
          }
        </div>
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
  path: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadResultRequest: PropTypes.func.isRequired,
  generateResultRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  result: selectors.selectResult(state),
  loading: selectors.selectLoading(state),
  path: selectors.selectPath(state),
});

const mapDispatchToProps = {
  loadResultRequest: actions.loadResultRequest,
  generateResultRequest: actions.generateResultRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(Result);
