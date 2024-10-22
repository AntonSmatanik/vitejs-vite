import * as yup from "yup";

export const damagedPartsOptions = ["roof", "front", "side", "rear"];

export const formSchema = yup.object().shape({
  amount: yup.number().min(0).max(300).required(),
  allocation: yup.number().min(0).max(300).required(),
  damagedParts: yup
    .array()
    .of(yup.string().oneOf(damagedPartsOptions))
    .required(),
  category: yup.string().required(),
  witnesses: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    })
  ),
});
