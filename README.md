# Angular 5 Project with Firebase Cloud Firestore (Ng5firestore)

====== Angular 5 with Firebase Firestore Cloud ======

— //[[bgp@proreact.dk|Bjarne Gerhardt-Pedersen]] 2018/01/29 10:19//—

===== Chapter 1: Angular 5 Project with Firebase setup =====

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


===== Chaper 1.1: Authentication and Users =====

Followed guide: [[https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/|https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/]]

Created an Auth service to inject in the Core module, that will facilitate sign-in, user session, save custom user data etc.

Write about guard, interface,

Next step 5

===== Chapter 2: Firebase Relations and centralized database =====

**Firebase datastructure to include relations ??? **

**Using firebase relations in dataservice ???**

**Using NgRx to handle client database actions ???**

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

===== Chapter 3 – Offline Mode =====

Offline mode Enabled

Enabling AngularFirestoreModule.enablePersistence will make offline mode possible, so current used data is cached, and any actions are stored and sent when back online.

Possible problems known:

  * There are not support for IE/Explorer - SiteKiosk for the Screens runs Explorer.
  * If its only currently used data, then what about sections of the app, that the user didnt visit or is not looking at? Solution: Fetching the whole state of the server initially as individual model observables and storing this on a client sided database (using NgRx for example) solvest his problem.

===== Chapter 4 – Costs =====

Documentation: [[https://firebase.google.com/pricing/|https://firebase.google.com/pricing/]] [[https://firebase.google.com/docs/firestore/pricing|https://firebase.google.com/docs/firestore/pricing]]

  * Costs are per document read/write/delete based storage cost bandwidth.
  * Solution: Using the idea for fetching all relevant data initially, store it in a client database and use the client to match the references through keys, fixes the multiplying duplication reading of relations and the otherwise huge costs.
  * Old Data Relation issue: Fetching example from IBG Manager on Stage required for clicking Activity tab and click 1 activity (NOTE: Special api for fetching Activity List, so this will be estimated example based on Stage Kapselfabrikken 1):
      * BASE DOCUMENT READS 14830
      * 3 Departments
      * 72 (36 Residents * 2 because 1 each ProfilePics)
      * 52 (26 Employees * 2 because each ProfilePics)
      * 60 (20 GroupConnections * 3 because 1 each Group and 1 each group has Institution)
      * 20 (10 ActivityClubs * 2 because of Resources)
      * 160 (80 Pictograms * 2 because of Resources)
      * 3 External Departments
      * 14.460 (723 Activities * 20 (3 Departments 1 ActivityClub 5 SignupEmployees 5 SignupResidents 5 Resources 1 CoverImages ))
      * CLICKING 1 ACTIVITY DOCUMENT READS: 66
      * (1 Activity 3 Departments 1 ActivityClubs 1 CoverImages 5 Resources 10 (5 * 2 ResponsibleEmployees) 10 (5 * 2 ResponsibleResidents) 10 (5 * 2 SignupEmployees) 2 (1 * 2 ResponsibleResidents) 8 (4 * 2 Pictograms) 4 (2 * 2 Groups) 5 GroupPosts 5 (1 * 5 Repeats w. GroupPosts) 1 NotificationSettingActivities)
      * TOTAL DOCUMENTS READ WOULD BE 14896, DOING THIS 6 TIMES WOULD READ 100K = 0.18$.
  * What about prices for development purposes? It seems prices are example 10 tests per day or 1 hours of tests per device priced? Do we need to pay for development, which can easily be expensive if errors are made. Solution: This will be restricted trough server rules and maybe Cloud Functions.
  * Firestore mentions exstra fees charged when using Cloud Firestore Security Rules per request: [[https://firebase.google.com/docs/firestore/pricing|https://firebase.google.com/docs/firestore/pricing]] which is a little bit hard to understand

===== Links =====

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

