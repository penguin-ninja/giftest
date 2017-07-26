import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './styles.css';

// @TODO update links to relative URLs
class Footer extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 text-center">
            <footer className={styles.footer}>
              <p>
                <a href="//www.socialsweethearts.de/terms.html" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.termsAndConditions" />
                </a> ·
                <a href="//www.socialsweethearts.de/privacy.html" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.privacy" />
                </a> ·
                <a href="//www.socialsweethearts.de/de_DE/imprint" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.imprint" />
                </a> ·
                <a href="https://en.nametests.com/accounts/feedback/?url=https://animatedtest.com/" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.feedback" />
                </a> ·
                <a href="//www.socialsweethearts.de/en_US/it-career" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.jobs" />
                </a> ·
                <a href="//docs.google.com/a/socialsweethearts.de/forms/d/1ggzWjZHk2m-KU-2leSanIcna3WeY4Wy_sieBoBsuhFA/viewform" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="footer.becomeAPartner" />
                </a> ·
              </p>
              <p>
                <a href="//www.socialsweethearts.de/terms.html" target="_blank" rel="noopener noreferrer">
                  Disclaimer: All content is provided for fun and entertainment purposes only</a>
              </p>
              <p className={styles.smallFooter}>
                This app uses data and contents only if they are publicly available or with the consent of the users.
                We kindly ask you to use the app only, if other users will not be affected adversely.
                <br />
                Thank you and have fun with our app!
              </p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
};

export default Footer;
