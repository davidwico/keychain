import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Switch,
} from 'react-native';
import * as Keychain from 'react-native-keychain';

const username = 'fakeuser';
const password = 'haxyhax222';

class App extends React.Component {
  state = {
    supportedBiometry: null,
    savePassWithBiometry: false,
    response: '',
  };

  async componentDidMount() {
    const supportedBiometry = await Keychain.getSupportedBiometryType();
    if (supportedBiometry) {
      this.setState(() => ({supportedBiometry}));
    }
  }

  setPassword = async () => {
    const setPass = await Keychain.setGenericPassword(username, password, {
      accessControl: this.state.savePassWithBiometry
        ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
        : null,
    });
    this.setState(() => ({response: JSON.stringify(setPass)}));
  };

  getPassword = async () => {
    const getPass = await Keychain.getGenericPassword({
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    });
    this.setState(() => ({response: JSON.stringify(getPass)}));
  };

  resetPassword = async () => {
    const resetPass = await Keychain.resetGenericPassword();
    this.setState(() => ({response: JSON.stringify(resetPass)}));
  };

  toggleSwitch = () => {
    this.setState(() => ({
      savePassWithBiometry: !this.state.savePassWithBiometry,
    }));
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              <Text style={styles.marginBottom}>
                Supported biometry type: {this.state.supportedBiometry}
              </Text>
              <Text style={styles.marginBottom}>
                Switch to save with biometry
              </Text>
              <Switch
                style={styles.marginBottom}
                value={this.state.savePassWithBiometry}
                onValueChange={this.toggleSwitch}
              />
              <TouchableOpacity
                onPress={this.setPassword}
                style={styles.button}>
                <Text>SET password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.getPassword}
                style={styles.button}>
                <Text>GET password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.resetPassword}
                style={styles.button}>
                <Text>RESET password</Text>
              </TouchableOpacity>
              <Text>{this.state.response}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default App;
