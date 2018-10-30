import React from 'react';
// import ReactGA from 'react-ga';
import { isDebug } from '../../utils/CommonUtils';

export default function withStatistics(WrappedComponent) {
  return class extends React.Component {
    render() {
      if (!isDebug()) {
        // ReactGA.set({ page: window.location.pathname + window.location.search });
        // ReactGA.pageview(window.location.pathname + window.location.search);
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
