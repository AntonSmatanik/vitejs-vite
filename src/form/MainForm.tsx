/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { damagedPartsOptions, formSchema } from "../utils/index";
import NestedFields from "./NestedFields";

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
const initialValues = {
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

const MainForm = () => {
  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Amount
            <input type="number" {...register("amount")} />
            {errors.amount && (
              <span className="error">{errors.amount.message}</span>
            )}
          </label>
        </div>

        <div>
          <fieldset>
            <legend>Damaged parts</legend>
            {damagedPartsOptions.map((part) => (
              <label key={part}>
                <input
                  type="checkbox"
                  {...register("damagedParts")}
                  value={part}
                />
                {part}
              </label>
            ))}
            {errors.damagedParts && (
              <span className="error">{errors.damagedParts.message}</span>
            )}
          </fieldset>
        </div>
        <NestedFields />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default MainForm;
