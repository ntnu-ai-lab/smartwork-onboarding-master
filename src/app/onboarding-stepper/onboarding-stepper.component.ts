import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  AbstractControl, ValidationErrors
} from "@angular/forms";
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatStepper, StepperOrientation} from '@angular/material/stepper';
import {Observable, combineLatest, merge, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import inclusionQuestionsJson from './inclusion-questions.json';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {BackendService} from "../services/backend.service";
import {NewPatient} from "../model/NewPatient";
import {getFormValidationErrors} from "../util/UIUtils";
import {environment} from 'src/environments/environment';
import {HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Clinician } from '../model/Clinician';
import {subscribeToObservable} from "rxjs/internal-compatibility";

type InclusionQuestion = {
  id: string,
  question: string,
  answers: { value: string, label: string }[],
  answerLabels: string[],
  exclusionOn: string,
  failureMessage?: string
};

/**
 *
 * A new patients opens a link from SMS, e.g. https://onboarding.smartwork.no/?navid=G1/N0
 * The sid is a query parameter referring to source ID, the value N0 represents patients from NAV and G1
 * represents patients coming from GP reccomendations.
 * A wizard with steps:
 * <ul>
 * <li>Short  information</li>
 * <li>Eligibility (self-assessed)</li>
 * <li>Patient information  (full)</li>
 * <li>Consenting? (Yes or No)</li>
 * <li>Registering new patient</li>
 * </ul>
 * Eligibility questions are loaded from inclusion-questions.json
 */

const BAD_URL_IMS = "Lenken du har klikket på er feil, forsøk å åpne lenken i eposten du har mottatt fra SmartWork på nytt. Dersom det fremdeles ikke virker kan du kontakte support på support@smartwork.no / tlf 93 224 342"

@Component({
  selector: 'onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent implements OnInit {

  ngOnInit() {
  }

  @ViewChild(MatStepper) private stepper? : MatStepper;
  stepperOrientation: Observable<StepperOrientation>;
  public formInclusion: FormGroup;
  public formInclusionCompleted = false;
  public formConsent: FormGroup;
  public formRegistration: FormGroup;
  public inclusionQuestions: InclusionQuestion[];
  public navID: string | null = null;
  public registeredUser: any | null = null;


  public eligiblityID: string | null = null;
  public registrationControls: {
    patientIdCtrl: FormControl;
    phoneCtrl: FormControl;
    emailCtrl: FormControl;
    confirmEmailControl: FormControl;
    firstnameCtrl: FormControl;
    lastnameCtrl: FormControl;
    languageCtrl: FormControl;
  };

  constructor(private formBuilder: FormBuilder,
              breakpointObserver: BreakpointObserver,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private backend: BackendService
  ) {
    this.route.queryParamMap.subscribe(params => {
      const navId = params.get('navid')
      if (navId) {
        // Check if navId contains "G" or "g" and assign "gp"
        if (navId.toLowerCase().includes('g')) {
        this.navID = "gp";
        }
        // Check if navId contains "N" or "n" and assign "nav"
        else if (navId.toLowerCase().includes('n')) {
        this.navID = "nav";
        }
        // Handle the case where navId is null or empty
      else {
      console.error('Error: navid is invalid');
      this.navID = null;  // Or handle the error case as needed
    }
  } else {
    alert (BAD_URL_IMS);
  }
        });

    this.inclusionQuestions = inclusionQuestionsJson as InclusionQuestion[];

    this.formInclusion = this.formBuilder.group(this.inclusionQuestions.reduce(
      (controls, q) =>
        (controls[q.id] = [
          '',
          //environment.production ? '' :
            //q.exclusionOn === 'yes' ? 'no' : 'yes', //in development just activate all valid answers
          Validators.required], controls), {} as { [p: string]: any })
    );

    // Consent

    this.formConsent = this.formBuilder.group({
      consentCtrl: ['', Validators.required]
    });

    // Trim email whitespaces
    const trimValidator = (control: AbstractControl): ValidationErrors | null => {
      if (control.value && typeof control.value === 'string') {
        const trimmed = control.value.trim();
        if (trimmed !== control.value) {
          control.setValue(trimmed, { emitEvent: false });
        }
      }
      return null;
    };


    // Registration
    this.registrationControls = {
      patientIdCtrl: new FormControl(environment.defaults?.username, [
        Validators.required, Validators.pattern('[a-zA-Z][\\w\\-]{3,20}')]),
      emailCtrl: new FormControl(environment.defaults?.email, [
        trimValidator,
        Validators.required,
        Validators.email,]),
      confirmEmailControl:  new FormControl(environment.defaults?.email, [
        trimValidator,
        Validators.required,
        Validators.email,
        (control) => {
          const email = control.value?.trim();
          // Hack
          if (this.registrationControls === undefined)
            return null;
          const mainEmail = this.registrationControls.emailCtrl.value?.trim();
          if (email !== mainEmail)
            return {badEmail: {value: email}};
          return null;
        },]),
      phoneCtrl: new FormControl(environment.defaults?.phone, [
        Validators.required,
        Validators.pattern("[\\d\\s\\(\\)+-]{3,20}")
      ]),
      firstnameCtrl: new FormControl('', Validators.required),
      lastnameCtrl: new FormControl('', Validators.required),
      languageCtrl: new FormControl('nb'),
    };
    this.formRegistration = new FormGroup(this.registrationControls);


    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

    this.GenerateUsername()

  }


  //create username automatically
  public GenerateUsername(length: any = 20) {
    const firstName = this.formRegistration.get('firstnameCtrl');
    const lastName = this.formRegistration.get('lastnameCtrl');
    const username = this.formRegistration.get('patientIdCtrl');
    const phone = this.formRegistration.get('phoneCtrl');

    if (!firstName || !lastName || !phone) {
      return
      }
    merge(firstName.valueChanges, lastName.valueChanges, phone.valueChanges)
      .subscribe(value => username?.setValue(
        firstName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(1,2) +
        firstName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(4,5) +
        firstName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(6,7) +
        lastName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(1,2) +
        lastName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(5,6) +
        lastName.value.replace(/ /g,'').toLowerCase().replace(/å/g,'aa').replace(/ø/g,'oe').replace(/æ/g,'ae').substring(8,9) +
        phone.value.replace(/ /g,'').toLowerCase().substring(1,2)+
        phone.value.replace(/ /g,'').toLowerCase().substring(4,5)+
        phone.value.replace(/ /g,'').toLowerCase().substring(7,8)
      ));
  }


  /**This is not made as a validator because it does not invalidate the answers, it changes the logic.*/
  private getExclusionReasons(): string[] {
    return this.inclusionQuestions
      .filter(q => this.formInclusion.get(q.id)?.value === q.exclusionOn)
      .map(q => q.failureMessage || q.question);
  }

  public onSubmitInclusion(): void {
    // Check exclusion before backend call
    const exclusionReasons = this.getExclusionReasons();
    if (exclusionReasons.length > 0) {
      this.router.navigate(['exclusion'], { state: { reasons: exclusionReasons } });
      return;
    }

    // Collect answers and send to backend
    const answers = this.inclusionQuestions.reduce(
      (map, q) => (map[q.id] = this.formInclusion.get(q.id)?.value, map),
      {} as { [p: string]: any });

    this.backend.sendEligibilityAnswers(answers)
      .pipe(catchError(err => {
        this.formInclusion.markAsUntouched();
        this.formInclusionCompleted = false;
        return this.handleError(err);
      }))
      .subscribe(response => {
        this.eligiblityID = response.id;
        this.formInclusionCompleted = true;

        if (this.stepper?.selected) {
          this.stepper.selected.completed = true;
          this.stepper?.next();
        }
      });
  }


  public onSubmitNotConsent() {
    this.router.navigateByUrl('exclusion')
  }

  public onSubmitRegistration() {
  /*if (!this.eligiblityID)
      throw Error("Missing eligibilityId"); */
    let newPatient = {
      patientId: this.registrationControls.patientIdCtrl.value,
      //clinicianId: this.clinicianID,
      navId: this.navID,
      eligibilityId: this.eligiblityID,
      email: this.registrationControls.emailCtrl.value,
      phone: this.registrationControls.phoneCtrl.value,
      consent: true,
      // consent: this.formConsent.get("consentCtrl")?.value,
      firstname: this.registrationControls.firstnameCtrl.value,
      lastname: this.registrationControls.lastnameCtrl.value,
      language: this.registrationControls.languageCtrl.value
    } as NewPatient;

    this.backend.sendRegistration(newPatient).subscribe(
      _ => {
        window.location.href = 'assets/done2.html'
        //window.location.href = 'https://supportprim-dev.idi.ntnu.no/onboarding-app/assets/done.html'
      },
      error => {
        this.snackBar.open(`${error.error}`, "Close");
      }
    )
  }

  getErrors() {
    return getFormValidationErrors(this.formRegistration).map(value => value.controlName);
  }

  /**Handles http request errors*/
  private handleError(error: HttpErrorResponse) {
    this.snackBar.open(`${error.statusText}`, "Close");
    return throwError('Something bad happened; please try again later.');
  }
}
