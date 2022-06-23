/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
  required: '${label} is required!',
  number: {
    range: '${label} must be between ${min} and ${max}'
  },
  string: {
    min: '${label} has to be bigger than ${min}'
  }
}

