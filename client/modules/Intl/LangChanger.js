import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import selectors from './redux/selectors';
import { switchLanguage } from './redux/actions';
import styles from './styles.css';

class LangChanger extends Component {
  _onLanguageChange = (evt) => {
    this.props.switchLanguage(evt.target.value);
  };

  render() {
    const { intl, enabledLanguages, locale } = this.props;
    return (
      <select id="langChanger" className={styles.langChanger} onChange={this._onLanguageChange} value={locale}>
        {
          enabledLanguages.map((lang) => (
            <option value={lang} key={lang}>{intl.formatMessage({ id: `lang.${lang}` })}</option>
          ))
        }
      </select>
    );
  }
}

LangChanger.propTypes = {
  intl: PropTypes.any.isRequired,
  enabledLanguages: PropTypes.any.isRequired,
  locale: PropTypes.string.isRequired,
  switchLanguage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  enabledLanguages: selectors.selectEnabledLangs(state),
  locale: selectors.selectCurrentLocale(state),
});

const mapDispatchToProps = (dispatch) => ({
  switchLanguage: (lang) => dispatch(switchLanguage(lang)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(LangChanger)
);
