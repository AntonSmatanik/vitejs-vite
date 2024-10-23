import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CATEGORIES_URL, CategoryOptions, FormType } from "../utils";

const Select = () => {
  const [categories, setCategories] = useState<CategoryOptions>([]);

  const {
    register,
    formState: { errors },
  } = useFormContext<FormType>();

  useEffect(() => {
    const loadData = async () => {
      const result = await fetch(CATEGORIES_URL);
      const data = await result.json();

      setCategories(data);
    };

    loadData();
  }, []);

  if (!categories.length) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default Select;
