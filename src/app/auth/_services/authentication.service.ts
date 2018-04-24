import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http,
        public afAuth: AngularFireAuth,
        public af: AngularFireDatabase,
    ) {
    }

    login(email: string, password: string) {

        return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                debugger;
                this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
                    .then((user) => {
                        firebase.database().ref('/users/' + user.uid + '').once('value',
                            function(snapshot) {
                                this.users = snapshot.val();
                                if (user.uid != '' || user.uid != undefined || user.uid != null) {
                                    localStorage.setItem('currentUser', JSON.stringify(user.uid));
                                    console.log('Token...', localStorage.setItem('currentUser', JSON.stringify(user.uid)))
                                }
                            }.bind(this)
                        );
                    }).catch(function(error) {
                        alert('Incorrect Email and Password....');
                    })
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.clear();
    }
}