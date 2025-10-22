import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private env = (window as any).env || {};

  get endpoints() {
    return {
        statusUrl : this.env.STATUS_URL || 'http://localhost:8014/dashboard/getStatus',
        eligibilityUrl: this.env.ELIGIBILITY_URL || 'http://localhost:8013/onboarding/eligibility',
        registerUrl: this.env.REGISTER_URL || 'http://localhost:8013/onboarding/patient',
    };
  }
}
