import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {NewPatient} from "../model/NewPatient";
import {Observable} from "rxjs";
import {AbstractControl} from "@angular/forms";

/**The stub of the backend service.
 * TODO: add calls to the backend
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public sendEligibilityAnswers(answers:{}): Observable<any> {
    return this.httpClient.post(environment.backend.endpoints.eligibility, answers);

  }

  public sendRegistration(newPatient: NewPatient){
    console.debug(`Sending registration information: ` + JSON.stringify(newPatient));
    return this.httpClient.post(environment.backend.endpoints.register, newPatient);
  }

  
  public getOnboardingStatus(navID: String): Observable<string>{
    return this.httpClient.get(environment.backend.endpoints.status + navID, {responseType: 'text'});
  }
  
}
