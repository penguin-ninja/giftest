import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';

import styles from './styles.css';
import fbImage from './next-button-f.png';

class FacebookButton extends Component {
  render() {
    const { currentSlug } = this.props;
    const href = `/auth/facebook?slug=${currentSlug}`;
    return (
      <a href={href} className={styles.facebookButton}>
        <img className={styles.fbImage} src={fbImage} alt="facebook" />
        <span className={styles.buttonText}><FormattedMessage id="quiz.loginFacebook" /></span>
      </a>
    );
  }
}

FacebookButton.propTypes = {
  currentSlug: PropTypes.string.isRequired,
};

const mapStatesToProps = (state) => ({
  currentSlug: selectors.selectSlug(state),
});

const mapDispatchToProps = {
  loadFacebookButtonDetailRequest: actions.loadFacebookButtonDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(FacebookButton);
