import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

import selectors from 'modules/Quiz/redux/selectors';
import actions from 'modules/Quiz/redux/actions';

import styles from './styles.css';
import fbImage from './next-button-f.png';
import loader from './loader.svg';

class FacebookButton extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

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

  _setLoading = () => {
    this.setState({ loading: true });
  }

  render() {
    const { currentSlug, user, lang } = this.props;
    const href = `/auth/facebook?slug=${currentSlug}&lang=${lang}`;
    const btnClass = cx(styles.facebookButton, {
      [styles.hasUser]: user,
    });

    if (this.state.loading) {
      return (
        <div className={styles.fbLoadingContainer}>
          <div className={styles.fbLoadingText}>
            <img src={loader} alt="loading" className={styles.loading} width="23" height="23" /> Please wait...
          </div>
        </div>
      );
    }

    return (
      <a href={href} className={btnClass} onClick={this._setLoading}>
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
  lang: PropTypes.string.isRequired,
  user: PropTypes.any,
};

const mapStatesToProps = (state) => ({
  currentSlug: selectors.selectSlug(state),
  lang: selectors.selectCurrentLocale(state),
  user: selectors.selectUser(state),
});

const mapDispatchToProps = {
  loadFacebookButtonDetailRequest: actions.loadFacebookButtonDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(FacebookButton);
