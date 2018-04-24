
import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ParamMap } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { FormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
// import swal from 'sweetalert2'
import "firebase/storage";
import * as $ from 'jquery';
@Component({
    selector: "app-account",
    templateUrl: "./myAccount.component.html",
    styleUrls: ['./myAcoount.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class MyAccountComponent implements OnInit {
    str: string = '';
    userID: any;
    model: any = {};
    fileList: any = {};
    username: '';
    userEmail: '';
    userPhoneNumber: '';
    userStr: string = '';
    oldPass: string = 'ssds'
    newPass: string = '';
    cNewPass: string = '';
    userImage = false;
    userViewImage = false;
    closeResult: string;
    selectedFiles: FileList;
    userEmailId: string = ''
    private basePath: string = '/uploads';
    constructor(
        public afAuth: AngularFireAuth,
        public af: AngularFireDatabase,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private route: ActivatedRoute,
        public _router: Router
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }
    ngOnInit() {

        //If Current UserID Null Redirect Login Page
        if (JSON.parse(localStorage.getItem('currentUser')) == null) {
            this._router.navigate(['./login']);
        }
        this.bindUserDetails();
    }
    //Change User Profile  Function
    saveChange() {
        var userDetails = {}
        if ((this.model.userPhoneNumber != '' || this.model.userPhoneNumber != undefined) || (this.model.username != '' || this.model.username != undefined)) {
            //rigth
            let userAllDetails = {
                userName: this.model.username,
                userPhoneNumber: this.model.userPhoneNumber
            }
            userDetails = userAllDetails;
        }
        if ((this.model.username == '' || this.model.username == undefined) && (this.model.userPhoneNumber != '' || this.model.userPhoneNumber != undefined)) {
            let userPhDetails = {
                userPhoneNumber: this.model.userPhoneNumber,
                userName: this.username
            }
            userDetails = userPhDetails;
        }
        if ((this.model.userPhoneNumber == '' || this.model.userPhoneNumber == undefined) && (this.model.username != '' || this.model.username != undefined)) {

            let userNameDetails = {
                userName: this.model.username,
                userPhoneNumber: this.userPhoneNumber
            }
            userDetails = userNameDetails;
        }
        if ((this.model.userPhoneNumber == '' || this.model.userPhoneNumber == undefined) && (this.model.username == '' || this.model.username == undefined)) {
            //rigth
            let userNotDetails = {
                userName: this.username,
                userPhoneNumber: this.userPhoneNumber
            }
            userDetails = userNotDetails;
        }

        this.userID = JSON.parse(localStorage.getItem('currentUser')).id

        firebase.database().ref().child("users").child(this.userID).update(userDetails).then(function(ref) {
            alert('save Changes Done');
        });
        window.location.reload();
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
                this.userPhoneNumber = this.items.userPhoneNumber
            }.bind(this)
        );
    }

    //Change Password Function
    changePassword() {
        this.changePasswordValidation();
        if (this.str == '') {
            this.afAuth.auth.signInWithEmailAndPassword(this.userEmail, this.model.oldPass)
                .then((user) => {
                    user.updatePassword(this.model.newPass).then((pass) => {
                        alert('Password change done..')
                    })
                }).catch(function(error) {
                    alert('Password are Roungh....');
                })
        }
    }

    //Detecte File when Image Upload
    detectFiles(event) {
        this.selectedFiles = event.target.files;
        let file = this.selectedFiles.item(0)
        this.pushImage(file);
        this.selectedFiles = null;

    }

    //Change Image File Upload Function
    detectChangeFiles(event) {
        debugger;
        this.selectedFiles = event.target.files;
        this.fileList = this.selectedFiles.item(0)

        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child(`${this.basePath}/${this.fileList.name}`).put(this.fileList);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => {
                // upload failed
                alert(error)
            },
            () => {
                // upload success
                this.fileList.url = uploadTask.snapshot.downloadURL
                var name = this.fileList.name
                this.UpdateFileData(this.fileList.url)
            }
        );
    }

    //Update File Data Function
    UpdateFileData(url) {
        var companyDetails = {
            userImage: url
        }
        this.userID = JSON.parse(localStorage.getItem('currentUser')).id
        firebase.database().ref().child("users").child(this.userID).update(companyDetails).then(function(ref) {
            alert('Profile Upload Done!')
        });
        this.ngOnInit();
    }

    //Select Image Function
    uploadImage() {
        let file = this.selectedFiles.item(0)
        this.pushImage(file);
    }

    //Image Push In Firebase  Storage Function 
    pushImage(file) {
        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child(`${this.basePath}/${file.name}`).put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => {
                // upload failed
                alert(error)
            },
            () => {
                // upload success
                file.url = uploadTask.snapshot.downloadURL
                var name = file.name
                this.saveFileData(file.url)
            }
        );
    }

    //Image Upload Data Save In Database 
    saveFileData(url) {
        var companyDetails = {
            userImage: url
        }
        this.userID = JSON.parse(localStorage.getItem('currentUser')).id
        firebase.database().ref().child("users").child(this.userID).update(companyDetails).then(function(ref) {
            alert('Profile Upload Done!')
            window.location.reload();
        });
    }

    //Change Pasword Validation
    changePasswordValidation() {
        if (this.model.oldPass == '' || this.model.oldPass == undefined || this.model.oldPass == null) {
            this.toastr.warning('Old Password Required...');
            this.str = this.str + 'CreditCar';
        }
        else {
            this.str = '';
        }
        if (this.model.newPass == '' || this.model.newPass == undefined || this.model.newPass == null) {
            this.toastr.warning('New Password Required...');
            this.str = this.str + 'CreditCar';
        }
        else {
            this.str = '';
        }
        if (this.model.conNewPass == '' || this.model.conNewPass == undefined || this.model.conNewPass == null) {
            this.toastr.warning('Confirm Password Required...');
            this.str = this.str + 'CreditCar';
        }
        else {
            this.str = '';
        }

        if (this.model.newPass.length <= 5) {
            this.toastr.warning('Please enter 6 or More then character enter...');
            this.str = this.str + 'CreditCar';
        }
        else {
            this.str = '';

        }
        if (this.model.newPass == this.model.conNewPass) {
            this.str = '';

        }
        else {
            this.toastr.warning('Password And Confirm Password Miss Mach...');
            this.str = this.str + 'CreditCar';
        }
    }
    cancle() {
        this.model.newPass = '';
        this.model.conNewPass = '';
        this.model.oldPass = '';
    }
    //Pesonal Details Validation Function


}