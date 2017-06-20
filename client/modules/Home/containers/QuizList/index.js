import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';

import QuizListItem from 'modules/Home/components/QuizListItem';
import selectors from 'modules/Home/redux/selectors';

class QuizList extends Component {
  _renderItems = () => {
    const { quizzes } = this.props;
    return quizzes.map((q) => (
      <QuizListItem
        key={q.get('_id')}
        _id={q.get('_id')}
        title={q.get('title')}
        imageUrl={q.get('imageUrl')}
      />
    ));
  }

  render() {
    return (
      <Row>
        {this._renderItems()}
      </Row>
    );
  }
}

QuizList.propTypes = {
  quizzes: PropTypes.any.isRequired,
};

const mapStatesToProps = (state) => ({
  quizzes: selectors.selectQuizzes(state),
});

export default connect(mapStatesToProps)(QuizList);
