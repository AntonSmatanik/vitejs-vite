/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import { useFormContext } from "react-hook-form";
import * as yup from "yup";
import { formSchema } from "../utils";

const NestedFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<yup.InferType<typeof formSchema>>();

  return (
    <>
      <div>
        <label>
          Allocation
          <input
            type="number"
            {...register("allocation", {
              min: 0,
              required: "Allocation is required",
            })}
          />
          {errors.allocation && (
            <span className="error">{errors.allocation.message}</span>
          )}
        </label>
      </div>
      <div>
        <label>
          Category
          <select {...register("category")}>
            <option value="">Select category</option>
            <option value="kitchen-accessories">kitchen-accessories</option>
            <option value="slug2">name2</option>
            <option value="slug3">name3</option>
          </select>
          {errors.category && (
            <span className="error">{errors.category.message}</span>
          )}
        </label>
      </div>
      <div>
        Witnesses
        <div className="witness">
          <label className="witness-name">
            Name
            <input
              type="text"
              {...register("witnesses.0.name", {
                required: "Name is required",
              })}
            />
            {errors.witnesses?.[0]?.name && (
              <span className="error">{errors.witnesses[0].name.message}</span>
            )}
          </label>
          <label className="witness-email">
            Email
            <input
              type="email"
              {...register("witnesses.0.email", {
                required: "Email is required",
              })}
            />
            {errors.witnesses?.[0]?.email && (
              <span className="error">{errors.witnesses[0].email.message}</span>
            )}
          </label>
        </div>
      </div>
    </>
  );
};

export default NestedFields;
