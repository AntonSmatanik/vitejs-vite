/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form. Formulář by měl splňovat:
 *
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 *
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import {
  damagedPartsOptions,
  formInitialValues,
  FormType,
  formValidationSchema,
} from "../utils/index";
import NestedFields from "./NestedFields";

const MainForm = () => {
  const formProps = useForm({
    resolver: yupResolver(formValidationSchema),
    defaultValues: formInitialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Amount
            <input
              className={errors.amount && "error"}
              type="number"
              {...register("amount")}
            />
          </label>
          {errors.amount && (
            <div className="error">{errors.amount.message}</div>
          )}
        </div>

        <div>
          <fieldset className={errors.damagedParts && "error"}>
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
          </fieldset>
          {errors.damagedParts && (
            <div className="error">{errors.damagedParts.message}</div>
          )}
        </div>
        <NestedFields />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default MainForm;
