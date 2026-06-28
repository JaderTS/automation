export const CREDENTIALS = {
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: process.env.STANDARD_PASSWORD ?? 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
} as const;

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export const ERROR_MESSAGES = {
  lockedUser: 'Sorry, this user has been locked out.',
  invalidCredentials: 'Username and password do not match',
  firstNameRequired: 'First Name is required',
  lastNameRequired: 'Last Name is required',
  postalCodeRequired: 'Postal Code is required',
} as const;
