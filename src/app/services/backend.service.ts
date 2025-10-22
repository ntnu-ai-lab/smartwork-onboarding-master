import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NewPatient} from "../model/NewPatient";
import {Observable} from "rxjs";
import {AbstractControl} from "@angular/forms";
import { ConfigService } from './config.service';

/**The stub of the backend service.
 * TODO: add calls to the backend
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  public sendEligibilityAnswers(answers:{}): Observable<any> {
    return this.http.post(this.config.endpoints.eligibilityUrl, answers);

  }

  public sendRegistration(newPatient: NewPatient){
    console.debug(`Sending registration information: ` + JSON.stringify(newPatient));
    return this.http.post(this.config.endpoints.registerUrl, newPatient);
  }

  
  /* 
  public sendFromStatus(navID: String): Observable<string>{
    return this.httpClient.get(environment.backend.endpoints.status + navID, {responseType: 'text'});
  } 
   */
    
  
}
