import React, { Component, PropTypes } from 'react'
import FullWidthSection from './full-width-section';
import HomeFeature from './home-feature';

import RaisedButton from 'material-ui/lib/raised-button';
import {StylePropable, StyleResizable} from 'material-ui/lib/mixins';
import {Colors, Spacing, Typography, lightBaseTheme} from 'material-ui/lib/styles';
import { mergeStyles } from 'material-ui/lib/utils/styles'

export default class Home extends Component {

  _getHomePageHero() {
    let styles = {
      root: {
        backgroundImage: "url(https://source.unsplash.com/random)",
        backgroundSize: 'cover',
        overflow: 'hidden',
      },
      tagline: {
        margin: '16px auto 0 auto',
        textAlign: 'center',
        maxWidth: 575,
      },
      label: {
        color: lightBaseTheme.palette.primary1Color,
      },
      githubStyle: {
        margin: '16px 32px 0px 8px',
      },
      demoStyle: {
        margin: '16px 32px 0px 32px',
      },
      h1: {
        color: Colors.darkWhite,
        fontWeight: Typography.fontWeightLight,
      },
      h2: {
        fontSize: 20,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
      },
      nowrap: {
        whiteSpace: 'nowrap',
      },
      taglineWhenLarge: {
        marginTop: 32,
      },
      h1WhenLarge: {
        fontSize: 56,
      },
      h2WhenLarge: {
        fontSize: 24,
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12,
      },
    };

    styles.h2 = mergeStyles(styles.h1, styles.h2);

    return (
      <FullWidthSection style={styles.root}>
        <div style={styles.tagline}>
          <h1 style={styles.h1}>material ui</h1>
          <h2 style={styles.h2}>
            A Set of React Components <span style={styles.nowrap}>
            that Implement</span> <span style={styles.nowrap}>
            Google&apos;s Material Design</span>
          </h2>
        </div>
      </FullWidthSection>
    );
  }


  _getHomeFeatures() {
    const styles = {maxWidth: 906};

    return (
      <FullWidthSection useContent={true} contentStyle={styles}>
        <HomeFeature
          heading="Get Started"
          route="/get-started"
          img="http://www.material-ui.com/images/get-started.svg"
          firstChild={true}
        />
        <HomeFeature
          heading="Customization"
          route="/customization"
          img="http://www.material-ui.com/images/css-framework.svg"
        />
        <HomeFeature
          heading="Components"
          route="/components"
          img="http://www.material-ui.com/images/components.svg"
          lastChild={true}
        />
      </FullWidthSection>
    );
  }

  _getHomeContribute() {
    const styles = {
      root: {
        backgroundColor: Colors.grey200,
        textAlign: 'center',
      },
      h3: {
        margin: 0,
        padding: 0,
        fontWeight: Typography.fontWeightLight,
        fontSize: 22,
      },
      button: {
        marginTop: 32,
      },
    };

    return (
      <FullWidthSection useContent={true} style={styles.root}>
        <h3 style={styles.h3}>
          Want to help make this <span style={styles.nowrap}>project awesome? </span>
          <span style={styles.nowrap}>Check out our repo.</span>
        </h3>
        <RaisedButton
          label="GitHub"
          primary={true}
          linkButton={true}
          href="https://github.com/callemall/material-ui"
          style={styles.button}
        />
      </FullWidthSection>
    );
  }
  render() {
    const style = {
      paddingTop: '14px'
    };

    return (
      <div style={style}>
        {this._getHomePageHero()}
        {this._getHomeFeatures()}
        {this._getHomeContribute()}
      </div>
    )
  }
}
