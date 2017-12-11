// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA0d6tgW2xI4ERmpNtqog3pG--BH9DGQrY',
    authDomain: 'angular-5-firestore-cloud.firebaseapp.com',
    databaseURL: 'https://angular-5-firestore-cloud.firebaseio.com',
    projectId: 'angular-5-firestore-cloud',
    storageBucket: 'angular-5-firestore-cloud.appspot.com',
    messagingSenderId: '67670224900'
  }
};
