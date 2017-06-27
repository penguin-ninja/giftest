import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import styles from './styles.css';

class QuizListItem extends Component {
  render() {
    const { slug, title, imageUrl } = this.props;
    return (
      <div className={cx(styles.quizListItem, 'text-center')}>
        <div className={styles.quizListItemInner}>
          <a href={`${process.env.SITE_URL}/quiz/${slug}`} className={styles.quizLink}>
            <img className="img-responsive" src={imageUrl} alt={title} />
            <span className={styles.quizTitle}>{title}</span>
          </a>
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
