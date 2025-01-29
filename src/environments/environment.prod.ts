export const environment = {
  production: true,
  backend: {
    endpoints:{
      eligibility: "https://smartwork.idi.ntnu.no/onboarding/eligibility",
      register: "https://smartwork.idi.ntnu.no/onboarding/patient",
      status: "https://smartwork.idi.ntnu.no/sendFromStatus/"
     
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
