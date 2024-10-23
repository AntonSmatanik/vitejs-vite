/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře nebude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie"z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL] - tato validace by měla mít debounce 500ms
 */

import { lazy, Suspense, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormType, INPUT_DEBOUNCE } from "../utils";

const LazySelect = lazy(() => import("./Select"));

const NestedFields = () => {
  const timer = useRef<any | null>(null);

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<FormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "witnesses",
  });

  return (
    <>
      <div>
        <label>
          Allocation
          <input
            className={errors.allocation && "error"}
            type="number"
            {...register("allocation", {
              disabled: !watch("amount"),
            })}
          />
        </label>
        {errors.allocation && (
          <div className="error">{errors.allocation.message}</div>
        )}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <LazySelect />
      </Suspense>
      <div>
        <fieldset className="withness">
          <legend>Witnesses</legend>

          {fields.map((field, index) => (
            <div key={field.id}>
              <div>
                <label>
                  Name
                  <input
                    className={errors.witnesses?.[index]?.name && "error"}
                    {...register(`witnesses[${index}].name`)}
                  />
                </label>

                {errors.witnesses?.[index]?.name && (
                  <div className="error">
                    {errors.witnesses[index]?.name?.message}
                  </div>
                )}
              </div>

              <div>
                <label>
                  Email
                  <input
                    className={errors.witnesses?.[index]?.email && "error"}
                    {...register(`witnesses[${index}].email`, {
                      onChange: (e) => {
                        if (timer.current) {
                          clearTimeout(timer.current);
                        }

                        timer.current = setTimeout(() => {
                          setValue(
                            `witnesses[${index}].email`,
                            e.target.value,
                            {
                              shouldValidate: true,
                            }
                          );
                        }, INPUT_DEBOUNCE);
                      },
                    })}
                  />
                </label>

                {errors.witnesses?.[index]?.email && (
                  <div className="error">
                    {errors.witnesses[index]?.email?.message}
                  </div>
                )}
              </div>

              <button type="button" onClick={() => remove(index)}>
                Remove Witness
              </button>
            </div>
          ))}

          <button type="button" onClick={() => append({ name: "", email: "" })}>
            Add Witness
          </button>

          {errors.witnesses && (
            <div className="error">{errors.witnesses.message}</div>
          )}
        </fieldset>
      </div>
    </>
  );
};

export default NestedFields;
