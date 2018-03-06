# Angular 5 Project with Firebase Cloud Firestore (Ng5firestore)

## Chapter 1: Overview of project

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
        * Handles all CRUD's (+implementing/updating items with standard info such as updatedAt, createdAt, + inserting user references for updatedBy and createdBy)
        * Using batch commits for multiple deletes/writes, for example if creating 100 items at once (max 500 at once)
        * Data Relation Function
          * Working as a promise
          * Reads all firestore references on one or more items
          * Sort out duplicates
          * Combines all fetches of the relations for a specified type of item (example: Activity)
          * Adds the response data to the relationData object on each item using the structure of the Relation interface
        * **Firebase data structure to include relations - see chapter 2**
        * **Using NgRx to handle client database actions - see chapter 2**
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
      * Font-Awesome
      * Moment
      * Lodash
      * ** Angular Material ??? https://material.angular.io/guide/getting-started
  * **Version Stamp?? tutorial [[https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d|https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d]]**
  * Production build and Firebase Deploy
      * [[https://angular-5-firestore-cloud.firebaseapp.com/|https://angular-5-firestore-cloud.firebaseapp.com/]]
  * Firebase Costs - Chapter 4


## Chapter 2: Firebase Relations and NgRx (statemanagement for client sided centralized database) ##

Example code created by me

  * Built a data service that fetches whole server state
  * Using a centralized client database that is always in sync with server data
  * The database is an observable that can be subscribed to by components
  * The database can modify the data comming from the server before its saved in database and sent to components
  * All client/server data happens in the data service by calling a method with type, action and payload.
  * MISSING Client must connect the references through the entity key Ids and populate data.

How to handle simple and complex relations client side and on the database?

  * Solution: Handling relations can be done by making the entities having an attribute, named after the relation, that is an object with Ids as keys to the references. Example:

<code>
"Booking": {
      "id": "fdsE55dfgfsd",
      "title": "My booking",
      "EmployeeSignups": {
        "KfdsfFdsf983": true,
        "jsdfSDF893fsS": true,
        "Kfd8023sdSSS": true
      }
    }

    "Employee": {
      "id": "KfdsfFdsf983",
      "firstname": "Karsten",
      "lastname": "Steen",
      "BookingSignups": {
        "fdsE55dfgfsd": true,
      }
    }
</code>

Fetching the whole state* of the server initially as individual model observables and storing this on a client sided database (using NgRx for example), the client can then connect the relations and populate the entities. The hard part is that all references needs to be kept updated/synced, because updating 1 entity, might need 8 other entities to be updated as well because of the references.

Querying data would be done both through the server observables and the client state management.

*Only relevant data for the user. This needs to be researched how to define what is relevant and how the data should be structured to fit this, and to be scalable.

  * Old Relation issues: Documentation: [[https://cloud.google.com/firestore/docs/solutions/arrays|https://cloud.google.com/firestore/docs/solutions/arrays]]

- "Although Cloud Firestore can store arrays, it does not support querying array members or updating single array elements". So, one hacky way of making relations, are making objects with IDs as keys and boolean as value, example: Activity.Signups = { userId1: true, userId2: true … }. If a query should be sorted on a timestamp, this can be used as value, but then the timestamp needs to be kept in sync everywhere it exists, which can quickly become a messy solution.

Documentation: [[https://stackoverflow.com/questions/46568850/what-is-firestore-reference-data-type-good-for?noredirect=1&lq=1|https://stackoverflow.com/questions/46568850/what-is-firestore-reference-data-type-good-for?noredirect=1&lq=1]] – There is no way of ”populating” from references. References is used for dependent lookups, that seems like join, but requires another round trip to server (document read cost).

Some very interesting but also costs money articles that might be very useful: [[https://angularfirebase.com/lessons/|https://angularfirebase.com/lessons/]]

I connected to Gitter ’angular/angularfire2’ for live chat community help. Also using StackOverflow tag angularfire2.

Old deleted examples with relations concept or no relations at all

  * Example #1: I have made a huge homemade example getting a list of Activitites that each includes Signups. Very messy solution – not useful.
  * Example #2: Stackoverflow mixed with Firestore documentation example getting data and id, and connected references in ActivitiesComponent. Not working.
  * Example #3: Youtube guide: [[https://www.youtube.com/watch?v=-GjF9pSeFTs&t=8s|https://www.youtube.com/watch?v=-GjF9pSeFTs&t=8s]] getting async snapshot data of activities list in order to get data and id of activities. Working but no refs.
  * Example #4: Youtube guide: [[https://www.youtube.com/watch?v=-GjF9pSeFTs&t=8s|https://www.youtube.com/watch?v=-GjF9pSeFTs&t=8s]] getting snapshot data of activities. Creating object with the data and id following an interface, subscribing and saving the static response in a list. Working but no refs.
  * Example #5: Created CRUD with Activities. Working but no refs.

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

