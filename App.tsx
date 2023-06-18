import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/app/store';
import { setToken } from './src/app/features/auth/authSlice';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({ children, title }: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }
type OnBoardProps = {
  showRealApp: boolean;
};

const Root = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // <NavigationContainer>
    //   <RootNavigator />
    //   </NavigationContainer>
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header />
      <Text>{process.env.REACT_APP_BASEURL}</Text>
    </ScrollView>
  );
};

const OnBoard = ({ showRealApp }: OnBoardProps): JSX.Element => {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => setShowApp(showRealApp), [showRealApp]);

  const setBoarding = useCallback(async () => {
    await AsyncStorage.setItem('isBoarded', 'boarded');
    setShowApp(true);
  }, []);

  const slides = [
    {
      key: 's1',
      title: 'We make your life easier',
      text: 'A hassle-free laundry services that will make you at ease in the comfort of your home.',
      image: {
        uri: require("./assets/images/1st.png"),
      },
    },
    {
      key: 's2',
      title: 'SIMPLE PLACE AN ORDER',
      text: 'Click. Add. Proceed. We\'re happy to serve you',
      image: {
        uri: require("./assets/images/2nd.png"),
      },
    },
    {
      key: 's3',
      title: 'PICK UP & DELIVERY SERVICE',
      text: 'No time to go in laundry centers? No problem, we got you!',
      image: {
        uri: require("./assets/images/3rd.png"),
      },
    },
    {
      key: 's4',
      title: 'THANK YOU FOR USING LABAH APP',
      text: 'No more mountain of dirty launrdry LABAH APP is here for you',
      image: {
        uri: require("./assets/images/4th.png"),
      },
    }
  ];

  console.log(slides)
  const RenderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View style={styles.introBanner}>
          <Image source={item.image.uri} />
        </View>
        <View style={styles.introLabel}>
          <Text style={styles.introTitleStyle}>{item.title}</Text>
          <Text style={styles.introTextStyle}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={styles.introButton}>
        <Text>Skip</Text>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.introButton}>
        <Text>Next</Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.introButton}>
        <Text>Done</Text>
      </View>
    );
  };
  console.log(showApp);
  return (
    <>
      {!showApp ? <AppIntroSlider
        data={slides}
        renderItem={RenderItem}
        renderSkipButton={renderSkipButton}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        onDone={() => setBoarding()}
        onSkip={() => setBoarding()}
        showSkipButton={true}
        showPrevButton={false}
        activeDotStyle={{ backgroundColor: '#0063F7' }}
      /> : <Root />}
    </>
  )
}

const PreLoadApp = (): JSX.Element => {
  const [showRealApp, setShowRealApp] = useState(false);
  const dispatch = useDispatch();

  const fetchToken = useCallback(async () => {
    const storedToken = await AsyncStorage.getItem("@access_data");
    if (storedToken) {
      dispatch(setToken(JSON.parse(storedToken)));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const fetchOnBoard = async () => {
    const checkOnBoard = await AsyncStorage.getItem('isBoarded');
    setShowRealApp(checkOnBoard != null ? true : false);
  };

  useEffect(() => {
    fetchOnBoard();
  }, [fetchOnBoard]);

  return <OnBoard showRealApp={showRealApp} />
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Provider store={store}>
        <PreLoadApp />
      </Provider>
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <Text>{process.env.REACT_APP_BASEURL}</Text> */}
      {/* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View> */}
      {/* </ScrollView> */}
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBanner: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introLabel: {
    paddingHorizontal: 24,
    flex: 1,
  },
  introButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#4E4E4E',
    height: 45
  },
  introTitleStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000'
  },
});

