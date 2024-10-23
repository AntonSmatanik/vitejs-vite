/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL] - tato validace by měla mít debounce 500ms
 */

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CategoryOptions, FormType } from "../utils";

const NestedFields = () => {
  const timer = useRef<any | null>(null);
  const [categories, setCategories] = useState<CategoryOptions>([]);

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

  useEffect(() => {
    const loadData = async () => {
      const result = await fetch("https://dummyjson.com/products/categories");
      const data = await result.json();
      setCategories(data);
    };

    loadData();
  }, []);

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

      {categories.length > 0 && (
        <div>
          <label>
            Category
            <select
              className={errors.category && "error"}
              {...register("category")}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          {errors.category && (
            <div className="error">{errors.category.message}</div>
          )}
        </div>
      )}

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
                    id={`witnesses[${index}].name`}
                    {...register(`witnesses[${index}].name`)}
                    placeholder="Enter witness name"
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
                    id={`witnesses[${index}].email`}
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
                        }, 500);
                      },
                    })}
                    placeholder="Enter witness email"
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
