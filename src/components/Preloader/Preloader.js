import React, { Component, PropTypes } from 'react';
import ReactF1 from 'react-f1';

import preloader from 'preloader';

import { states, IDLE, OUT, HIDE } from './PreloaderF1States';
import transitions from './PreloaderF1Transitions';
import styles from './Preloader.css';

/**
 * Preloader component
 */
export default class Preloader extends Component {

  static get propTypes() {
    return {
      stageWidth: PropTypes.number,
      stageHeight: PropTypes.number,
      onLoaded: PropTypes.func,
      onHidden: PropTypes.func,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      go: OUT,
      progress: 0,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    window.setTimeout(() => {
      this.setState({ go: IDLE });
      this.load();
    }, 0);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.loader = null;
  }

  /**
   * loaderProgressHandler
   */
  loaderProgressHandler(progress) {
    this.setState({ progress });
  }

  /**
   * loaderCompleteHandler
   */
  loaderCompleteHandler() {
    this.props.onLoaded();
    this.hide();
  }

  /**
   * load
   */
  load() {
    this.loader = preloader({ xhrImages: false });
    this.loader.on('progress', () => this.loaderProgressHandler());
    this.loader.on('complete', () => this.loaderCompleteHandler());

    this.loader.addImage('assets/images/yeoman.png');

    this.loader.load();
  }

  /**
   * hide
   */
  hide() {
    this.setState({ go: HIDE });
  }

  /**
   * completeAnimationHandler
   */
  completeF1Handler() {
    if (this.state.go === HIDE) {
      this.props.onHidden();
    }
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { stageWidth, stageHeight } = this.props;

    const styleContainer = {
      width: stageWidth,
      height: stageHeight,
    };

    return (
      <ReactF1
        className={styles.Preloader}
        go={this.state.go}
        states={states(stageHeight)}
        transitions={transitions()}
        onComplete={() => this.completeF1Handler()}
      >
        <div className={styles.container} data-f1="container" style={styleContainer}>
          <section>
            <p data-f1="title">Loading...</p>
            <div data-f1="progressbar" className={styles.progressbar} />
          </section>
        </div>
      </ReactF1>
    );
  }
}
