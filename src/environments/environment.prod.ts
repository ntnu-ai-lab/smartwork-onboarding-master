export const environment = {
  production: true,
  backend: {
    endpoints:{
      //eligibility: "https://supportprim-fastlege.idi.ntnu.no/onboarding/eligibility",
      eligibility: "https://supportprim-dev.idi.ntnu.no/onboarding/eligibility",
      //register: "https://supportprim-fastlege.idi.ntnu.no/onboarding/patient",
      register: "https://supportprim-dev.idi.ntnu.no/onboarding/patient",
      //clinicians: "https://supportprim-fastlege.idi.ntnu.no/onboarding/getCliniciansByClinic/"
      //clinicians: "https://supportprim-dev.idi.ntnu.no/onboarding/getCliniciansByClinic/"
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
