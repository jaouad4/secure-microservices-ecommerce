import { useForm } from "react-hook-form";
import Input, { Textarea } from "../common/Input";
import Button from "../common/Button";

/**
 * Product Form component for creating/editing products
 */
const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      quantity: "",
    },
  });

  const onFormSubmit = (data) => {
    // Convert string values to appropriate types
    const formattedData = {
      name: data.name,
      description: data.description || "",
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity, 10),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        label="Nom du produit"
        placeholder="Entrez le nom du produit"
        required
        error={errors.name?.message}
        {...register("name", {
          required: "Le nom est obligatoire",
          minLength: {
            value: 2,
            message: "Le nom doit contenir au moins 2 caractères",
          },
        })}
      />

      <Textarea
        label="Description"
        placeholder="Entrez une description du produit"
        rows={3}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Prix (€)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
          error={errors.price?.message}
          {...register("price", {
            required: "Le prix est obligatoire",
            min: {
              value: 0,
              message: "Le prix doit être positif",
            },
            valueAsNumber: true,
          })}
        />

        <Input
          label="Quantité en stock"
          type="number"
          min="0"
          placeholder="0"
          required
          error={errors.quantity?.message}
          {...register("quantity", {
            required: "La quantité est obligatoire",
            min: {
              value: 0,
              message: "La quantité ne peut pas être négative",
            },
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
