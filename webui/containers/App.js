import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SessionActions from '../actions/session';
import Header from '../components/Header'

import AppBar from 'material-ui/lib/app-bar';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import Avatar from 'material-ui/lib/avatar';
import FontIcon from 'material-ui/lib/font-icon';
import {Spacing} from 'material-ui/lib/styles';

import { Colors, getMuiTheme } from 'material-ui/lib/styles';
import { prepareStyles } from 'material-ui/lib/utils/styles'
import FullWidthSection from './full-width-section';

class App extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {sessionActions } = this.props;
    sessionActions.load();
  }

  getStyles() {
    const darkWhite = Colors.darkWhite;
    const styles = {
      appBar: {
        position: 'fixed',
        backgroundColor: Colors.blueGrey500,
        zIndex: getMuiTheme().zIndex.appBar + 1,
        top: 0,
      },
      iconStyleRight: {
        marginTop: "13px"
      },
      root: {
        paddingTop: Spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: Spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${Spacing.desktopGutter * 2}px ${Spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: Colors.lightWhite,
        maxWidth: 335,
      },
      iconButton: {
        color: darkWhite,
      },
    };
    return styles;
  }

  render() {
    const styles = this.getStyles();
    const { children, session } = this.props
    let avatar = (
      <Avatar icon={<FontIcon className="muidocs-icon-communication-voicemail" />} />
    )
    if(!session.guest) {
      avatar = (
        <Avatar src={session.avatar} />
      )
    }
    const userMenu = (
      <IconMenu
         iconButtonElement={avatar}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      />
    )
    return (
      <div>
        <AppBar
          title="Aboard"
          iconElementLeft={<div></div>}
          iconElementRight={userMenu}
          iconStyleRight={styles.iconStyleRight}
          style={styles.appBar}
        />
        {children}
        <FullWidthSection style={styles.footer}>
          <p>
            {'Hand crafted with love by the engineers at '}
            <a style={styles.a} href="http://call-em-all.com">
              Call-Em-All
            </a>
            {' and our awesome '}
            <a href="https://github.com/callemall/material-ui/graphs/contributors" >
              contributors
            </a>.
          </p>
          <IconButton
            iconStyle={styles.iconButton}
            iconClassName="muidocs-icon-custom-github"
            href="https://github.com/callemall/material-ui"
            linkButton={true}
          />
        </FullWidthSection>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sessionActions: bindActionCreators(SessionActions, dispatch),
    dispatch
  };
}

function mapSessionToProps(state) {
  return {
    session: state.session.toJS()
  }
}

export default connect(
  mapSessionToProps,
  mapDispatchToProps
)(App);
