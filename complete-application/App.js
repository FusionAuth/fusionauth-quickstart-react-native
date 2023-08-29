import {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Button, Text, View} from 'react-native';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAutoDiscovery,
  useAuthRequest,
} from 'expo-auth-session';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import styles from './changebank.style';

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_FUSIONAUTH_URL);

  const redirectUri = makeRedirectUri({
    scheme: 'io.fusionauth.app',
  });

  const [request, response, promptAsync] = useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
    scopes: ['openid', 'offline_access'],
    usePKCE: true,
    redirectUri,
  }, discovery);

  // This is being called after we are redirected back to this page after initial login
  useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        exchangeCodeAsync({
          clientId: process.env.EXPO_PUBLIC_FUSIONAUTH_CLIENT_ID,
          code: response.params.code,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
          redirectUri,
        }, discovery).then(setAccessToken).catch((error) => {
          console.error(error);
        });
        return;
      }

      // You should handle errors here :)
      console.error(response);
    }
  }, [response]);

  const blurhash =
      '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={[styles.pageContainer, {marginTop: Constants.statusBarHeight}]}>
          <View style={styles.pageHeader}>
            <View style={styles.logoHeader}>
              <Image source="https://fusionauth.io/assets/img/samplethemes/changebank/changebank.svg"
                     style={styles.image}
                     placeholder={blurhash}
                     contentFit="cover"
                     transition={1000}
              />
              <View style={styles.hRow}>
                <Text style={styles.buttonLg}>Log in</Text>
              </View>
            </View>

            <View style={styles.menuBar}>
              <Text style={styles.menuLink} href="/">Home</Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            <View style={styles.columnContainer}>
              <View style={styles.appContainer}>
                <Text style={styles.h1}>Log in to manage your account</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  );

  return (
      <View style={styles.container}>
        <Text>Welcome to FusionAuth</Text>
        {(accessToken)
            ? <Text>{JSON.stringify(accessToken)}</Text>
            : <Button disabled={!request}
                      title="Log in"
                      onPress={() => promptAsync()}></Button>}
        <StatusBar style="auto"/>
      </View>
  );
}
