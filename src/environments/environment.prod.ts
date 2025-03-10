export const environment = {
  production: true,
  backend: {
    endpoints:{
      eligibility: "https://smartwork-onboarding.idi.ntnu.no/onboarding/eligibility",
      register: "https://smartwork-onboarding.idi.ntnu.no/onboarding/patient",
      //status: "http://smartwork-onboarding.idi.ntnu.no/sendFromStatus/"
      //eligibility: "http://localhost:8013/onboarding/eligibility",
      //register: "http://localhost:8013/onboarding/patient",
     
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
