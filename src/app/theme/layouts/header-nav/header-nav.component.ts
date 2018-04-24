import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { FormsModule } from '@angular/forms';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
    userImage = false;
    userViewImage = false;
    userID: any;
    model: any = {};
    username: '';
    userEmail: '';
    constructor(public afAuth: AngularFireAuth,
        public af: AngularFireDatabase,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private route: ActivatedRoute,
        public _router: Router
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }
    ngOnInit() {
        let user = JSON.parse(localStorage.getItem('currentUser'))
        if (JSON.parse(localStorage.getItem('currentUser')) == null) {
            this.toastr.warning('Invalid Email Id and Password !!');
            this._router.navigate(['./login']);
        }
        this.bindUserDetails();
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }
    //User Derails Bind Function
    bindUserDetails() {
        let user = JSON.parse(localStorage.getItem('currentUser')).id
        firebase.database().ref('/users/' + user + '').once('value',
            function(snapshot) {
                this.items = snapshot.val();
                if (this.items.userImage == '') {
                    this.userImage = true;
                    this.userViewImage = false;
                }
                else {
                    this.userViewImage = true;
                    this.userImage = false;
                }
                this.username = this.items.userName
                this.userEmail = this.items.userEmail;
            }.bind(this)
        );
    }
    logout() {
        debugger;
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.clear();
        this._router.navigate(['/login']);
    }
}