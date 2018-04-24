import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { LoginCustom } from './_helpers/login-custom';
import { Helpers } from '../helpers';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    str: string = '';

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        public afAuth: AngularFireAuth,
        public af: AngularFireDatabase,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo3/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    }
    signin() {
        this.afAuth.auth.signInWithEmailAndPassword(this.model.email, this.model.password)
            .then((user) => {
                firebase.database().ref('/users/' + user.uid + '').once('value',
                    function(snapshot) {
                        this.users = snapshot.val();
                    }.bind(this)
                );
                localStorage.setItem('key', user.uid);
                localStorage.setItem('currentUser', JSON.stringify({ id: user.uid }));
                this._router.navigate(['account']);
            }).catch(function(error) {
                alert('Incorrect Email and Password....');
            })
    }

    signup() {


        var userDetails = {
            userName: this.model.fullname,
            userEmail: this.model.email,
            userImage: '',
            userPhoneNumber: ''
        }
        if (this.model.password.length >= 6) {
            this.str = ''
        }
        else {
            this.toastr.warning('Password are 6 OR More then 6');
            this.str = this.str + 'Password';
        }
        if (this.model.password == this.model.rpassword) {
            this.str = ''
        }
        else {
            this.toastr.warning('Password and Confirm Password Missmatch');
            this.str = this.str + 'Password';
        }
        if (this.str == '') {

            this.loading = true;
            this.afAuth.auth.createUserWithEmailAndPassword(this.model.email, this.model.password)
                .then(function(user) {
                    console.log('user..', user)
                    firebase.database().ref().child("users").child(user.uid).set(userDetails).then(function(ref) {
                        alert('registratin sucessfully')

                    });
                }).catch(function(error) {
                    alert('EmailId Allready Exist')
                });
            if (0 == 0) {
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            }
        }
    }

    forgotPass() {
        this.loading = true;
        this.afAuth.auth.sendPasswordResetEmail(this.model.email).then(function(user) {
            alert('Password Reset Check your Email.....')
        }).catch(function(error) {
            alert("Please enter valid email Id !!");

        })
        if (0 == 0) {
            this.loading = false;
            LoginCustom.displaySignInForm();
            this.model = {};
        }
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}