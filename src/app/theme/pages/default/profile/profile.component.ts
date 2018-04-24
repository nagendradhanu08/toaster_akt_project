import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
    oldPass: string = ''

    constructor() {

    }
    ngOnInit() {

    }

}