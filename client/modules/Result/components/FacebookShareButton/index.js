import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import selectors from 'modules/Result/redux/selectors';
import styles from './styles.css';
import fbImage from './fb-button-f.png';

class FacebookShareButton extends Component {
  _onShare = () => {
    const { result: resultImmutable, path } = this.props;
    const result = resultImmutable.toJS();

    FB.ui({
      method: 'share',
      caption: result.quiz.question,
      hashtag: '#animatedtest',
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
  result: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
};

const mapStatesToProps = (state) => ({
  result: selectors.selectResult(state),
  path: selectors.selectPath(state),
});

export default connect(mapStatesToProps)(FacebookShareButton);
