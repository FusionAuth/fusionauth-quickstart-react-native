import {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import CurrencyInput from 'react-native-currency-input';
import styles from './changebank.style';
import {openBrowserAsync} from 'expo-web-browser';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  exchangeCodeAsync,
  fetchUserInfoAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  AuthRequest,
  AuthSessionResult
} from 'expo-auth-session';
import {Image} from 'expo-image';
import {StatusBar} from 'expo-status-bar';

export default function App() {
  const [authResponse, setAuthResponse] = useState(null);
  const [amount, setAmount] = useState(0);
  const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_FUSIONAUTH_URL);

  const redirectUri = makeRedirectUri({
    scheme: Constants.expoConfig.scheme,
    path: 'redirect',
  });

  const [requestLogin, responseLogin, promptLogin] = useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
    scopes: ['openid', 'offline_access'],
    usePKCE: true,
    redirectUri,
  }, discovery);

  const [requestRegister, responseRegister, promptRegister] = useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
    scopes: ['openid', 'offline_access'],
    usePKCE: true,
    redirectUri,
  }, (discovery) ? {
    ...discovery,
    authorizationEndpoint: discovery.authorizationEndpoint.replace('/authorize', '/register')
  } : null);

  const logout = async () => {
    const params = new URLSearchParams({
      client_id: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
      post_logout_redirect_uri: redirectUri,
    });
    await openBrowserAsync(discovery.endSessionEndpoint + '?' + params.toString()).then(() => setAuthResponse(null));
  };

  const handleError = (error) => {
    console.error(error);
    alert(error.message);
  };

  /**
   * This will handle login and register operations
   *
   * @param {AuthRequest} request
   * @param {AuthSessionResult} response
   */
  const handleOperation = (request, response) => {
    if (!response) {
      return;
    }

    if (response.type !== 'success') {
      handleError(response.error || {
        message: `Operation failed: ${response.type}`
      });
      return;
    }

    exchangeCodeAsync({
      clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
      code: response.params.code,
      extraParams: {
        code_verifier: request.codeVerifier,
      },
      redirectUri,
    }, discovery).then((response) => {
      fetchUserInfoAsync(response, discovery).then((userRecord) => setAuthResponse({
        accessToken: response.accessToken,
        user: userRecord,
      })).catch(handleError);
    }).catch(handleError);
  };

  useEffect(() => {
    handleOperation(requestLogin, responseLogin);
  }, [responseLogin]);

  useEffect(() => {
    handleOperation(requestRegister, responseRegister);
  }, [responseRegister]);

  const amountCents = amount * 100;
  const nickels = Math.floor(amountCents / 5);

  return (
      <View style={styles.container}>
        <StatusBar style="auto"/>
        <View style={[styles.pageHeader, {marginTop: Constants.statusBarHeight}]}>
          <View style={styles.logoHeader}>
            <Image
                source={require('./assets/changebank.svg')}
                style={styles.image}
                contentFit="contain"
                transition={1000}
            />
            <View style={styles.hRow}>
              {(authResponse) ? (
                  <>
                    <Text style={styles.headerEmail}>{authResponse.user.email}</Text>
                    <TouchableOpacity disabled={!requestLogin} onPress={() => logout()}>
                      <Text style={styles.buttonLg}>Log out</Text>
                    </TouchableOpacity>
                  </>
              ) : (
                  <>
                    <TouchableOpacity disabled={!requestLogin} onPress={() => promptLogin()}>
                      <Text style={styles.buttonLg}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!requestLogin} onPress={() => promptRegister()}>
                      <Text style={styles.buttonLg}>Register</Text>
                    </TouchableOpacity>
                  </>
              )}
            </View>
          </View>

          <View style={styles.menuBar}>
            <Text style={styles.menuLink}>{(authResponse) ? 'Make Change' : 'Home'}</Text>
          </View>
        </View>

        <View style={styles.appContainer}>
          {(authResponse) ? (
              <>
                <Text style={styles.h1}>We Make Change</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.changeLabel}>Amount in USD:</Text>
                  <CurrencyInput
                      prefix="$ "
                      value={amount}
                      onChangeValue={setAmount}
                      style={styles.changeInput}
                  />
                </View>
                <Text style={styles.changeMessage}>
                  We can make change for ${(amount || 0).toFixed(2)} with {nickels} nickels and{' '}
                  {Math.round(amountCents % 5)} pennies!
                </Text>
              </>
          ) : (
              <Text style={styles.h1}>Log in to manage your account</Text>
          )}
        </View>
      </View>
  );
}
