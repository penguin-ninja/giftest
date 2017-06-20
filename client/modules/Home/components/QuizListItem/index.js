import React, { Component, PropTypes } from 'react';
import { Col } from 'react-bootstrap';

import { getQuizUrl } from 'utils';
import styles from './styles.css';

class QuizListItem extends Component {
  render() {
    const { _id, title, imageUrl } = this.props;
    const quizUrl = getQuizUrl(_id, title);
    return (
      <Col xs={12} sm={6} md={4}>
        <div className={styles.quizListItemInner}>
          <a href={quizUrl} className={styles.quizLink}>
            <img className="img-responsive" src={imageUrl} alt={title} />
            <span className={styles.quizTitle}>{title}</span>
          </a>
        </div>
      </Col>
    );
  }
}

QuizListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default QuizListItem;
