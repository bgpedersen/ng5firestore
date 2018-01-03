import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Activity } from '../shared/interfaces/Activity';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  public activities = [];

  constructor(public db: AngularFirestore) { }



  // ***  EXAMPLE #1 HOME MADE EXAMPLE
  // Very bad flow of getting list of activities and then getting each signup from the key reference and converting that to data.

  // Get User from ref
  getUserFromRef(ref) {
    return new Promise((resolve, reject) => {
      ref
        .get()
        .then(result => {
          // Convert content
          const user = result.data();
          console.log('ActivitiesComponent: EXAMPLE #1: getUserFromRef: user: ', user);
          resolve(user);
        });
    });
  }

  // Handle Signups
  convertSignups(item) {
    return new Promise((resolve, reject) => {

      const promises = [];
      // For each signup - get user from reference
      for (const key in item.signups) {
        if (!item.signups.hasOwnProperty(key)) {
          continue;
        }
        promises.push(this.getUserFromRef(item.signups[key]));
      }
      Observable.forkJoin(promises)
        .subscribe(results => {
          console.log('ActivitiesComponent: EXAMPLE #1: convertSignups: results: ', results);
          item.signups = results;
          resolve(item);
        });
    });
  }

  getActivities() {
    this.activities = [];

    this.db.collection('activities')
      .valueChanges()
      .subscribe(res => {
        console.log('ActivitiesComponent: EXAMPLE #1: activities: res: ', res);

        // For each Activity
        const promises = [];
        for (let i = 0; i < res.length; i++) {
          promises.push(this.convertSignups(res[i]));
        }
        Observable.forkJoin(promises)
          .subscribe(results => {
            console.log('ActivitiesComponent: EXAMPLE #1: results: ', results);
            this.activities = results;
            console.log('ActivitiesComponent: EXAMPLE #1: this.activities: ', this.activities);
          });
      });
  }
  // ***  /EXAMPLE #1 HOME MADE EXAMPLE



  // *** EXAMPLE #2 STACKOVERFLOW EXAMPLE https://stackoverflow.com/questions/46568850/what-is-firestore-reference-data-type-good-for?noredirect=1&lq=1
  getActivities2() {
    this.db.collection('activities')
      .snapshotChanges()
      .map(actions => {
        console.log('ActivitiesComponent: EXAMPLE #2: activities: actions: ', actions);
        return actions.map(a => {
          console.log('ActivitiesComponent: EXAMPLE #2: activities: a: ', a);
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          if (data.signups) {
            console.log('ActivitiesComponent: EXAMPLE #2: activities: data.signups: ', data.signups);
            for (const key in data.signups) {
              if (!data.signups.hasOwnProperty(key)) {
                continue;
              }
              data.signups[key].get()
                .then(results => {
                  console.log('ActivitiesComponent: EXAMPLE #2: activities: data.signups exists: results: ', results);
                  data.signups[key] = results.data();
                  return { id, ...data };
                })
                .catch(err => console.error(err));
            }
          } else {
            return { id, ...data };
          }
        });
      })
      // .map(data => {
      //   console.log('ActivitiesComponent: EXAMPLE #2: activities: data: ', data);
      //   data.forEach(doc => {
      //     console.log('ActivitiesComponent: EXAMPLE #2: activities: doc: ', doc);
      //     if (doc.signups) {
      //       console.log('ActivitiesComponent: EXAMPLE #2: activities: data.signups exists');
      //       for (const key in doc.signups) {
      //         if (!doc.signups.hasOwnProperty(key)) {
      //           continue;
      //         }
      //         doc.signups[key].get()
      //           .then(results => {
      //             console.log('ActivitiesComponent: EXAMPLE #2: activities: data.signups exists: results: ', results);
      //             doc.signups[key] = results.data();
      //             return doc;
      //           })
      //           .catch(err => console.error(err));
      //       }
      //     }
      //   })
      // })
      .subscribe(response => {
        console.log('ActivitiesComponent: EXAMPLE #2: activities: response: ', response);

        // response.forEach(item => {
        //   console.log('ActivitiesComponent: EXAMPLE #2: activities: forEach item: ', item);

        //   if (item.signups) {
        //     for (const key in item.signups) {
        //       if (!item.signups.hasOwnProperty(key)) {
        //         continue;
        //       }
        //       this.db.doc(item.signups[key])
        //         .snapshotChanges()
        //         .then(results => {
        //           item.userData = results.data()
        //         })
        //         .catch(err => console.error(err));
        //     }
        //   }
        // })
      })
  }


  // .subscribe(results => {
  //   console.log('ActivitiesComponent: EXAMPLE #2: activities: results: ', results);
  //   this.activities = [];

  //   results.forEach(doc => {
  //     const newItem = doc.data();
  //     newItem.id = doc.id;
  //     if (newItem.signups) {
  //       newItem.signups.snapshotChanges()
  //         .then(results => { newItem.userData = results.data() })
  //         .catch(err => console.error(err));
  //     }
  //     this.activities.push(newItem);
  //   });

  //   console.log('ActivitiesComponent: EXAMPLE #2: this.activities: ', this.activities);
  // })
  // .catch((err) => { console.error(err) });

  ngOnInit() {
    // this.getActivities();
    this.getActivities2();
  }


}
