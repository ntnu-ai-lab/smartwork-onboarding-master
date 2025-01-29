export const environment = {
  production: true,
  backend: {
    endpoints:{
      eligibility: "https://smartwork-onboarding.idi.ntnu.no/onboarding/eligibility",
      register: "https://smartwork-onboarding.idi.ntnu.no/onboarding/patient",
      status: "https://smartwork-onboarding.idi.ntnu.no/sendFromStatus/"
     
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
