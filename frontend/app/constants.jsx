export const API_URL = import.meta.env.VITE_API_URL;

export const ROLES = {
  Admin: 'ROLE ADMIN',
  Organizer: 'ROLE ORGANIZER',
  Member: 'ROLE MEMBER'
};
export const EMAIL_PROVIDER = {
  Email: 'Email',
  Google: 'Google'
};

export const COUPON_TYPE = [
  { value: "FIXED", label: "Fixed" },
  { value: "PERCENTAGE", label: "Percentage" }
]

export const COUPON_APPLY = [
  { value: "ONE", label: "One" },
  { value: "MULTIPLE", label: "Multiple" }
]

export const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY
