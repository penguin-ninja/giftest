import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';

import styles from './styles.css';
import fbImage from './next-button-f.png';

class FacebookButton extends Component {
  _renderButtonText = () => {
    const { user } = this.props;
    if (!user) return (<FormattedMessage id="quiz.loginFacebook" />);
    const userDetail = user.toJS();
    return `Continue as ${userDetail.firstName}`;
  }

  _renderProfileImg = () => {
    const { user } = this.props;
    if (!user) return null;
    const userDetail = user.toJS();

    return (<img className={styles.profileImg} src={userDetail.profileImage} alt={`${userDetail.firstName} ${userDetail.lastName}`} />);
  }

  render() {
    const { currentSlug, user } = this.props;
    const href = `/auth/facebook?slug=${currentSlug}`;
    const btnClass = cx(styles.facebookButton, {
      [styles.hasUser]: user,
    });

    return (
      <a href={href} className={btnClass}>
        <img className={styles.fbImage} src={fbImage} alt="facebook" />
        <span className={styles.buttonText}>{this._renderButtonText()}</span>
        {this._renderProfileImg()}
      </a>
    );
  }
}

FacebookButton.defaultProps = {
  user: undefined,
};

FacebookButton.propTypes = {
  currentSlug: PropTypes.string.isRequired,
  user: PropTypes.any,
};

const mapStatesToProps = (state) => ({
  currentSlug: selectors.selectSlug(state),
  user: selectors.selectUser(state),
});

const mapDispatchToProps = {
  loadFacebookButtonDetailRequest: actions.loadFacebookButtonDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(FacebookButton);
