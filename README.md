# Angular 5 Project with Firebase Cloud Firestore (Ng5firestore)

  * Angular 5 built with Angular CLI
  * Project setup in Firebase using Firestore Cloud database
  * AngularFire2 library integrated in app to use Firebase
  * Angular 5 Modular structure following best practice pattern: Core module injected in App module, which provides shared features like auth, guard, interfaces, data-service, logging etc.
  * Authentication and Users - Chapter 1.1
  * Firestore Cloud Database relations & centralized client database – Chapter 2
  * Offline mode enabled – Chapter 3
  * Routing Module
      * Protected routes using Guard
      * Guard using the Observable Firebase User from the Authentication service
  * Interfaces/Classes/Models
      * **Activity (needs more TypeScript/ES research to extend for view models etc.)**
      * **Booking (needs more TypeScript/ES research to extend for view models etc.)**
      * **Database (needs more TypeScript/ES research to extend for view models etc.)**
      * AlertMessage
  * Services
      * Alert Message service using Observable and interface and NG-Bootstrap alert component
      * Authentication Service using AngularFireAuth and Firebase User
        * **Authentication Users relation til Database users ???**
        * **Authentication Users and Database User Roles ???**
        * Log in (anonymously, google, email/password)
        * Log out
        * Sign up w. email/password
        * Firebase user subscription handler for calling data service to:
          * Insert User object in database and creating reference subscriptions.
          * Unsubscribing references, clearing database and navigate to login
        * Observable Firebase User authentication state observable for guarded routes
        * Showing User details using the User Object
      * Data service
        * Declaring database and database observable
        * Database action handler
        * Subscribing and unsubscribing server references
        * Fetching and converting all server data
        * Using interfaces and classes to create entitites
        * **Firebase datastructure to include relations**
        * **Using firebase relations in dataservice**
        * **Using NgRx to handle client database actions ???**
  * Components
      * Bookings
      * Activities
  * Firebase Costs - Chapter 4
  * 3rd Party libraries via NPM
      * NG-Bootstrap
      * Bootstrap 4
      * Font-Awesome
      * Moment
  * **Version Stamp?? tutorial [[https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d|https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d]]**
  * Production build and Firebase Deploy
      * [[https://angular-5-firestore-cloud.firebaseapp.com/|https://angular-5-firestore-cloud.firebaseapp.com/]]


## Ng5firestore

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

