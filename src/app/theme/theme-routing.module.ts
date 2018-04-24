import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "children": [
            {
                "path": "index",
                "loadChildren": ".\/pages\/aside\/index\/index.module#IndexModule"
            },
            {
                "path": "inner",
                "loadChildren": ".\/pages\/default\/inner\/inner.module#InnerModule"
            },
            {
                "path": "team",
                "loadChildren": ".\/pages\/default\/teamSetting\/teamSetting.module#teamSettingModule"
            },

            {
                "path": "account",
                "loadChildren": ".\/pages\/default\/myAcoount\/myAccount.module#accountModule"
            },
            {
                "path": "membership",
                "loadChildren": ".\/pages\/default\/membership\/membership.module#membershipModule"
            },
            {
                "path": "apikey",
                "loadChildren": ".\/pages\/default\/apiKey\/apiKey.module#apikeyModule"
            },
            {
                "path": "profile",
                "loadChildren": ".\/pages\/default\/profile\/profile.module#ProfileModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            }
        ]
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [RouterModule,

    ]
})
export class ThemeRoutingModule { }