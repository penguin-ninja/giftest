import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Helmet from 'react-helmet';
import selectors from 'modules/Result/redux/selectors';
import actions from 'modules/Result/redux/actions';
import { loadResultRequest as loadResultSaga } from 'modules/Result/redux/sagas';

import styles from './styles.css';

class Result extends Component {
  componentWillMount() {
    this.props.loadResultRequest(this.props.params.resultId);
  }

  render() {
    const { result: resultImmutable, loading } = this.props;
    if (loading || !resultImmutable) {
      return <div>Loading...</div>;
    }

    const result = resultImmutable.toJS();

    return (
      <div className="container">
        <Helmet>
          <title>{`Animatedtest - ${result.user.firstName}'s Result`}</title>
          <meta name="description" content={result.quiz.question} />
        </Helmet>
        <div className={cx('jumbotron text-center', styles.resultContainer)}>
          <h2>{result.quiz.question}</h2>
          <div className={styles.imgContainer}>
            <img className="img-responsive" src={result.image} alt={result.quiz.question} />
          </div>
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
  loading: PropTypes.bool.isRequired,
  loadResultRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  result: selectors.selectResult(state),
  loading: selectors.selectLoading(state),
});

const mapDispatchToProps = {
  loadResultRequest: actions.loadResultRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(Result);
