import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header';
import Footer from './components/Footer';
import actions from 'modules/Layout/redux/actions';
import { loadUserDetailRequest as loadUserDetailSaga } from 'modules/Layout/redux/sagas';
import favicon from './favicon.png';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentWillMount() {
    this.props.loadUserDetailRequest();
  }

  componentDidMount() {
    this.setState({ isMounted: true }); // eslint-disable-line
  }

  render() {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet>
            <title>Animated Test</title>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="fb:app_id" content={process.env.FB_CLIENT_ID} />
            <meta property="og:site_name" content="Animatedtest" />
            <link rel="icon" href={favicon} />
          </Helmet>
          <div>
            <Header />
            {this.props.children}
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

Layout.preload = () => ([
  [loadUserDetailSaga],
]);

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  loadUserDetailRequest: PropTypes.func.isRequired,
};

const mapStatesToProps = () => ({
});

const mapDispatchToProps = {
  loadUserDetailRequest: actions.loadUserDetailRequest,
};

export default connect(mapStatesToProps, mapDispatchToProps)(Layout);
