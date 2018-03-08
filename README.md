# Angular 5 Web Project with Firebase Cloud Firestore (Ng5firestore)

## Overview of project

  * Angular 5 built with Angular CLI
  * Project setup in Firebase using Firestore Cloud database
  * AngularFire2 library integrated in app to use Firebase
  * Angular 5 Modular structure following best practice pattern: Core module injected in App module, which provides shared features like auth, guard, interfaces, data-service, logging etc.
  * Offline mode enabled
      * All current data is cached
      * If offline then actions are remembered and called when back online
      * Possible problem: There are not support for IE - SiteKiosk use IE
  * Routing Module
      * Protected routes using Guard
      * Guard using the observable user from the Authentication service
  * Interfaces/Classes
      * Database (Interface, contains BehaviorSubjects to be used in the ObservableDatabase)
      * ObservableDatabase (Interface, contains Observables from the Database)
      * Relation (Interface, defining the architecture for a relation)
      * ActivityRelation (Interface, defining all possible relations)
      * ActivityInterface (Interface, Used in Activity Class to control the constructor input)
      * Activity (Class, implements ActivityInterface, used when clicking an activity/new/updating/creating)
      * Group
      * User (Contains the database user object, not the auth object)
      * AlertMessage
  * Services
      * Alert Message service using NG-Bootstrap alert component (needs work!)
      * Authentication Service using AngularFireAuth and Firebase User
        * Authentication User relation to Database user via UID
        * Exposes User observable check/data for guards, components and the DataService
        * Log in / logout (Google)
        * **User Roles ???**
        * **Create User (currently creating user if not already existing with UID) ???**
      * Data service
        * Server references object (containing all references to be maintained one place)
        * Database
          * Stores the actual server data always in sync as BehaviorSubjects (using cache)
        * ObservableDatabase
          * Readonly database that exposes the data from the private database as observables to the components
        * Fetches all data from server (only if logged in)
        * Handles all CRUD's (+implementing/updating items with standard info such as updatedAt, createdAt, + inserting user references for updatedBy and createdBy) + converting to pure JS objects
        * Using batch commits for multiple deletes/writes, for example if creating 100 items at once (max 500 at once)
        * Data Relation Function
          * Working as a promise
          * Reads all firestore references on one or more items
          * Sort out duplicates
          * Combines all fetches of the relations for a specified type of item (example: Activity)
          * Adds the response data to the relationData object on each item using the structure of the Relation interface
        * **Lazy load limit (example load 50 activities first, and when scroll to end, load more)**
        * **Firebase data structure to include relations ???**
        * **Using NgRx to handle client database actions ???**
  * Components Main (using ObservableDatabase from DataService)
      * Activities (list/details view + CRUD)
      * Users
      * Profile
  * Components Shared
      * Navigation component
      * ** List Component ???
      * ** Detail Component ???
  * 3rd Party libraries via NPM
      * NG-Bootstrap
      * Bootstrap 4
        * **Application optimize for responsive viewing ???**
      * Font-Awesome
      * Moment
      * Lodash
      * ** Angular Material ??? https://material.angular.io/guide/getting-started
  * **Version Stamp?? tutorial [[https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d|https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d]]**
  * Production build and Firebase Deploy
      * [[https://angular-5-firestore-cloud.firebaseapp.com/|https://angular-5-firestore-cloud.firebaseapp.com/]]
  * Firebase Costs - Chapter 4

## Links ##

  * AngularFireBase: [[https://angularfirebase.com/lessons/|https://angularfirebase.com/lessons/]]
  * AngularFire2: [[https://github.com/angular/angularfire2|https://github.com/angular/angularfire2]]
  * Authentication Tutorial: [[https://alligator.io/angular/firebase-authentication-angularfire2/|https://alligator.io/angular/firebase-authentication-angularfire2/]]
  * Firestore Cloud Documentation: [[https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0|https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0]]
  * NG5 integration with Firestore: [[https://blog.cloudboost.io/angular-5-with-firebases-cloud-firestore-87b5d6c13ff|https://blog.cloudboost.io/angular-5-with-firebases-cloud-firestore-87b5d6c13ff]]
  * NG-Bootstrap: [[https://ng-bootstrap.github.io/#/components/accordion/examples|https://ng-bootstrap.github.io/#/components/accordion/examples]]
  * NgRx: [[https://github.com/ngrx/platform|https://github.com/ngrx/platform]]
  * NgRx: [[https://angularfirebase.com/lessons/firebase-with-angular-ngrx-redux/|https://angularfirebase.com/lessons/firebase-with-angular-ngrx-redux/]]
  * Angular Structure: [[https://medium.com/@motcowley/angular-folder-structure-d1809be95542|https://medium.com/@motcowley/angular-folder-structure-d1809be95542]]

## Ng5firestore

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

