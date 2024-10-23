import * as yup from "yup";

export const INPUT_DEBOUNCE = 500;
export const CATEGORIES_URL = "https://dummyjson.com/products/categories";

export const damagedPartsOptions = ["roof", "front", "side", "rear"];

export const formInitialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ["side", "rear"],
  category: "kitchen-accessories",
  witnesses: [
    {
      name: "Marek",
      email: "marek@email.cz",
    },
    {
      name: "Emily",
      email: "emily.johnson@x.dummyjson.com",
    },
  ],
};

const EMAIL_CHECK_URL = "https://dummyjson.com/users/search?q=";

export const formValidationSchema = yup.object().shape({
  amount: yup.number().min(0).max(300).required().typeError("Must be a number"),
  allocation: yup
    .number()
    .min(0)
    .max(yup.ref("amount"))
    .required()
    .typeError("Must be a number"),
  damagedParts: yup.array().min(1, "Check at least one").required(),
  category: yup.string().required("Required"),
  witnesses: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Required"),
        email: yup
          .string()
          .email("Must be a valid email")
          .required("Required")
          .test("email-exists", "Email already in use", async (value) => {
            if (!value) return true;

            const response = await fetch(`${EMAIL_CHECK_URL}${value}`);
            const data = await response.json();

            return data.users.length === 0;
          }),
      })
    )
    .min(1, "Add at least one")
    .max(5, "Max 5"),
});

export type FormType = yup.InferType<typeof formValidationSchema>;

export type CategoryOptions = { slug: string; name: string }[];
