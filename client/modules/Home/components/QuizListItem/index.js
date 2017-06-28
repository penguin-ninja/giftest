import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { Link } from 'react-router';

import styles from './styles.css';

class QuizListItem extends Component {
  render() {
    const { slug, title, imageUrl } = this.props;
    return (
      <div className={cx(styles.quizListItem, 'text-center')}>
        <div className={styles.quizListItemInner}>
          <Link to={`/quiz/${slug}`} className={styles.quizLink}>
            <img className="img-responsive" src={imageUrl} alt={title} />
            <span className={styles.quizTitle}>{title}</span>
          </Link>
        </div>
      </div>
    );
  }
}

QuizListItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default QuizListItem;
