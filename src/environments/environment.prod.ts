export const environment = {
  production: true,
  backend: {
    endpoints:{
      eligibility: "https://supportprim-dev.idi.ntnu.no/onboarding/eligibility",
      register: "https://supportprim-dev.idi.ntnu.no/onboarding/patient",
      status: "https://supportprim-dev.idi.ntnu.no/sendFromStatus/"
     
    }
  },
  defaults:{
    username: "",
    email: "",
    phone: ""
  }
};
