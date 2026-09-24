const { withAppDelegate, withInfoPlist } = require('@expo/config-plugins');

/**
 * Przyjęcie cyklu życia `UIScene` — wymaganego przez SDK iOS 27.
 *
 * Bez tego aplikacja NIE STARTUJE: UIKit sprawdza to przy uruchomieniu
 * (`_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`) i kończy
 * proces instrukcją `brk`, czyli sygnałem 5, zanim zdąży cokolwiek zalogować.
 * Komunikat w binarce UIKit brzmi: „Application failed to launch: UIScene life
 * cycle is required for apps built with this SDK".
 *
 * Expo 57 dostarcza gotowy `ExpoAppSceneDelegate`, ale szablon `prebuild`
 * jeszcze go nie podpina — stąd ta wtyczka. Gdy zrobi to sam Expo
 * (prawdopodobnie w SDK 58), tę wtyczkę należy usunąć.
 *
 * Robi dwie rzeczy:
 *  1. Wpisuje manifest scen do `Info.plist`, wskazując delegat Expo.
 *  2. Przestawia `AppDelegate`: fabryka React Native zostaje, ale OKNO tworzy
 *     już scena. Gdyby robiły to obie, aplikacja miałaby dwa okna i dwa
 *     korzenie Reacta.
 */
const SCENE_DELEGATE = 'EXExpoAppSceneDelegate';

const withSceneManifest = (config) =>
  withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      // Jedno okno — aplikacja dla dziecka nie ma czego dzielić na sceny.
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: SCENE_DELEGATE,
          },
        ],
      },
    };
    return cfg;
  });

const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (cfg) => {
    let src = cfg.modResults.contents;

    // `ExpoAppSceneDelegate` woła `UIApplication.shared.delegate` i wymaga, by
    // ten deklarował zgodność z protokołem — inaczej rzuca `fatalError`.
    if (!src.includes('ExpoReactNativeFactoryProvider')) {
      src = src.replace(
        'class AppDelegate: ExpoAppDelegate {',
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
      );
    }

    // Okno i start Reacta przejmuje scena (`scene(_:willConnectTo:)`).
    src = src.replace(
      /#if os\(iOS\) \|\| os\(tvOS\)\s*\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*\n\s*factory\.startReactNative\([\s\S]*?\)\s*\n#endif\n/,
      '    // Okno tworzy ExpoAppSceneDelegate przy podłączeniu sceny.\n'
    );

    cfg.modResults.contents = src;
    return cfg;
  });

module.exports = (config) => withSceneAppDelegate(withSceneManifest(config));
