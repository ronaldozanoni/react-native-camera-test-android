import React, {PropTypes} from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  InteractionManager,
} from 'react-native';

import styles from './camera.styles';
import RNCamera from 'react-native-camera';

export default class Camera extends React.Component {

  static propTypes = {
    videoButton: PropTypes.bool,
    flashButton: PropTypes.bool,
    typeButton: PropTypes.bool,
    onTakePhoto: PropTypes.func,
  };

  static defaultProps = {
    videoButton: false,
    flashButton: true,
    typeButton: true,
    onTakePhoto: function() {}
  }

  constructor (props) {
    super(props);

    this.state = {
      shouldRenderCamera: false,
      camera: {
        aspect: RNCamera.constants.Aspect.fill,
        captureTarget: RNCamera.constants.CaptureTarget.cameraRoll,
        type: RNCamera.constants.Type.back,
        orientation: RNCamera.constants.Orientation.auto,
        flashMode: RNCamera.constants.FlashMode.auto,
      },
    };
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: RNCamera.constants.CaptureMode.video})
          .then((data) => console.log(data))
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = RNCamera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = RNCamera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = RNCamera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = RNCamera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }

    return icon;
  }

  renderVideoActions () {

    let videoButtonComponent = (
      <TouchableOpacity
          style={styles.captureButton}
          onPress={this.startRecording}
      >
        <Image
            source={require('./assets/ic_videocam_36pt.png')}
        />
      </TouchableOpacity>
    );

    if (this.state.isRecording) {
      videoButtonComponent = (
        <TouchableOpacity
            style={styles.captureButton}
            onPress={this.stopRecording}
        >
          <Image
              source={require('./assets/ic_stop_36pt.png')}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.videoButtonWrapper}>
        {videoButtonComponent}
      </View>
    );
  }

  takePicture = () => {
    console.log('taking picture here -->', this.camera);
    if (this.camera) {
      this.camera.capture()
        .then((data) => {

          this.hideCamera();
          this.props.onTakePhoto(data);
        })
        .catch((err) => {

          this.hideCamera();
          this.props.onError && this.props.onError();
        });
    }
  }

  hideCamera () {

    this.setState({
      shouldRenderCamera: false
    });
  }

  onClose = () => {

    this.hideCamera();
    this.props.onCancel && this.props.onCancel();
  }

  renderCameraWithTimeout () {

    setTimeout(() => {

      this.setState({
        shouldRenderCamera: true
      });
    }, 50)
  }

  renderCamera () {

    console.log('rendering camera...');

    return (
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={this.state.camera.aspect}
        captureTarget={this.state.camera.captureTarget}
        type={this.state.camera.type}
        flashMode={this.state.camera.flashMode}
        defaultTouchToFocus
        mirrorImage={false}
      />
    )
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        shouldRenderCamera: true,
      });
    });
  }

  render() {

    const {videoButton, flashButton, typeButton, visible} = this.props;

    const { shouldRenderCamera } = this.state;

    return (

        <View style={styles.container}>

          { shouldRenderCamera ? this.renderCamera() : null }

          <View style={[styles.overlay, styles.topOverlay]}>
            <Button title="close" color="#841584" onPress={this.onClose} />

            {typeButton &&
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
            >
              <Image
                source={this.typeIcon}
              />
            </TouchableOpacity>
            }

            {flashButton &&
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <Image
                source={this.flashIcon}
              />
            </TouchableOpacity>
            }
          </View>


          <View style={[styles.overlay, styles.bottomOverlay]}>
            {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.takePicture}
              >
                <Image
                    source={require('./assets/ic_photo_camera_36pt.png')}
                />
              </TouchableOpacity>
              ||
              null
            }

            { videoButton && this.renderVideoActions() }
          </View>
        </View>

    );
  }
}