import * as yup from 'yup';

export const stringFieldRequired = yup.string().required("This field is required");
