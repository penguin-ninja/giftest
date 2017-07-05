import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';

import QuizListItem from 'modules/Home/components/QuizListItem';
import selectors from 'modules/Home/redux/selectors';
import actions from 'modules/Home/redux/actions';

import styles from './styles.css';

class QuizList extends Component {
  componentWillMount() {
    this.props.loadQuizlistRequest();
  }

  _renderItems = () => {
    const { quizlist } = this.props;
    return quizlist.map((q) => (
      <QuizListItem
        key={`${q.get('_id')}${Math.random()}`}
        title={q.get('question')}
        slug={q.get('slug')}
        imageUrl={q.get('titleImage')}
      />
    ));
  }

  render() {
    return (
      <Row className={styles.quizList}>
        {this._renderItems()}
      </Row>
    );
  }
}

QuizList.propTypes = {
  quizlist: PropTypes.any.isRequired,
  loadQuizlistRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = (state) => ({
  quizlist: selectors.selectQuizlist(state),
});

const mapDispatchToProps = {
  loadQuizlistRequest: actions.loadQuizlistRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(QuizList);
