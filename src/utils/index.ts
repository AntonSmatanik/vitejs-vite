import * as yup from "yup";

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
const EMAIL_INPUT_DEBOUNCE = 500;

const emailExists = async (value: string): Promise<boolean> => {
  const response = await fetch(`${EMAIL_CHECK_URL}${value}`);
  const data = await response.json();

  return data.users.length === 0;
};

let validatedEmails = new Map<string, boolean>();
let timeouts = new Map<string, number>();

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
          .required("Required")
          .email("Must be a valid email")
          .test(
            "email-exists",
            "Email already in use",
            async (value, { path }) => {
              //  preventing to run the validation again if the email has been already validated
              if (validatedEmails.has(value)) {
                return validatedEmails.get(value);
              }

              //  preventing to run the validation if not needed, because yup does not support validation chain order
              await yup.string().required().validate(value);
              await yup.string().email().validate(value);

              //  debouncing the email validation
              return new Promise((resolve) => {
                let timeoutId = timeouts.get(path);

                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeouts.delete(path);
                }

                timeoutId = setTimeout(async () => {
                  const exists = await emailExists(value);
                  validatedEmails.set(value, exists);
                  resolve(exists);
                }, EMAIL_INPUT_DEBOUNCE);

                timeouts.set(path, timeoutId);
              });
            }
          ),
      })
    )
    .min(1, "Add at least one")
    .max(5, "Max 5"),
});

export type FormType = yup.InferType<typeof formValidationSchema>;

export type CategoryOptions = { slug: string; name: string }[];
