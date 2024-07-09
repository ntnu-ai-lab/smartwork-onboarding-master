import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnboardingStepperComponent} from "./onboarding-stepper/onboarding-stepper.component";
import {ExcludedDialogComponent} from "./excluded-dialog/excluded-dialog.component";

const routes: Routes = [
	{ path: '', component: OnboardingStepperComponent },
	{ path: 'exclusion', component: ExcludedDialogComponent },

	];

@NgModule({
	imports: [RouterModule.forRoot(routes, { enableTracing: false })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
