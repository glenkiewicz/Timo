const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Usuwa uprawnienie powiadomień push (`aps-environment`).
 *
 * `expo-notifications` wpina się automatycznie i zawsze je dodaje, a Timo
 * używa wyłącznie LOKALNEGO przypomnienia o Wyprawie Dnia (planowanego przez
 * telefon, src/lib/reminders.ts), które tego uprawnienia nie potrzebuje.
 * Z nim build sklepowy padał: profil App Store nie ma możliwości Push
 * Notifications. Gdyby kiedyś doszły powiadomienia z serwera — usunąć tę
 * wtyczkę i włączyć Push Notifications dla App ID w Apple Developer.
 */
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults['aps-environment'];
    return cfg;
  });
};
