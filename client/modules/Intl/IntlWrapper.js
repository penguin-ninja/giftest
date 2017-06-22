import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';

function IntlWrapper(props) {
  return (
    <IntlProvider {...props.intl} >
      {props.children}
    </IntlProvider>
  );
}

IntlWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  intl: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    intl: state.get('intl').toJS(),
  };
}

export default connect(mapStateToProps)(IntlWrapper);
