export const environment = {
  production: true,
  backend: {
    endpoints:{
      eligibility: "https://supportprim-fastlege.idi.ntnu.no/onboarding/eligibility",
      register: "https://supportprim-fastlege.idi.ntnu.no/onboarding/patient"
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
