import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import selectors from './redux/selectors';
import { switchLanguage } from './redux/actions';

class LangChanger extends Component {
  _onLanguageChange = (lang) => () => {
    this.props.switchLanguage(lang);
  };

  render() {
    const { intl, enabledLanguages, locale } = this.props;
    return (
      <NavDropdown id="langChanger" title={intl.formatMessage({ id: `lang.${locale}` })} onClick={this._onClick}>
        {
          enabledLanguages.map((lang) => (
            <MenuItem eventKey={lang} key={lang} onClick={this._onLanguageChange(lang)}>
              <FormattedMessage id={`lang.${lang}`} />
            </MenuItem>
          ))
        }
      </NavDropdown>
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
