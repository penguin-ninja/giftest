import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import selectors from 'modules/Result/redux/selectors';
import styles from './styles.css';
import fbImage from './next-button-f.png';

class FacebookShareButton extends Component {
  _onShare = () => {
    const { path } = this.props;
    FB.ui({
      method: 'share',
      href: `${process.env.SITE_URL}${path}`,
    });
  }

  render() {
    return (
      <div className={styles.facebookButton} onClick={this._onShare}>
        <img className={styles.fbImage} src={fbImage} alt="facebook" />
        <span className={styles.buttonText}><FormattedMessage id="result.shareFacebook" /></span>
      </div>
    );
  }
}

FacebookShareButton.propTypes = {
  path: PropTypes.string.isRequired,
};

const mapStatesToProps = (state) => ({
  path: selectors.selectPath(state),
});

export default connect(mapStatesToProps)(FacebookShareButton);
