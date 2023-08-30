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

  const [request, response, promptAsync] = useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
    scopes: ['openid', 'offline_access'],
    usePKCE: true,
    redirectUri,
  }, discovery);

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

  useEffect(() => {
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
  }, [response]);

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
                    <TouchableOpacity disabled={!request} onPress={() => logout()}>
                      <Text style={styles.buttonLg}>Log out</Text>
                    </TouchableOpacity>
                  </>
              ) : (
                  <TouchableOpacity disabled={!request}
                                    onPress={() => promptAsync()}>
                    <Text style={styles.buttonLg}>Log in</Text>
                  </TouchableOpacity>
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
                  {amountCents % 5} pennies!
                </Text>
              </>
          ) : (
              <Text style={styles.h1}>Log in to manage your account</Text>
          )}
        </View>
      </View>
  );
}
