import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatStepperModule} from '@angular/material/stepper';
import {AppComponent} from './app.component';
import {OnboardingStepperComponent} from './onboarding-stepper/onboarding-stepper.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {ExcludedDialogComponent} from './excluded-dialog/excluded-dialog.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatListModule} from "@angular/material/list";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [
    AppComponent,
    OnboardingStepperComponent,
    ExcludedDialogComponent
  ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatDialogModule,
        MatListModule,
        MatSnackBarModule,
        MatToolbarModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
