import * as yup from "yup";

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

export const formValidationSchema = yup.object().shape({
  amount: yup.number().min(0).max(300).required(),
  allocation: yup.number().min(0).max(yup.ref("amount")).required(),
  damagedParts: yup.array().min(1).required(),
  category: yup.string().required(),
  witnesses: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        email: yup
          .string()
          .email()
          .required()
          .test("email-exists", "Email already in use", async (value) => {
            if (!value) return true;

            const response = await fetch(
              `https://dummyjson.com/users/search?q=${value}`
            );
            const data = await response.json();

            return data.users.length === 0;
          }),
      })
    )
    .min(1)
    .max(5),
});

export type FormType = yup.InferType<typeof formValidationSchema>;

export type CategoryOptions = { slug: string; name: string }[];
