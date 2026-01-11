import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  createUser,
  updateUser,
} from "../../entities/user/model/usersThunks.ts";
import { useAppDispatch } from "../../shared/hooks/redux.ts";
import type { User, UserFormData } from "../../entities/user/model/types.ts";

interface Props {
  user?: User;
  onSubmit: () => void;
  onCancel: () => void;
}

export const UserForm = ({ user, onSubmit, onCancel }: Props) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          skills: user.skills.map((s) => ({ value: s })),
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          skills: [{ value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const submitHandler = async (data: UserFormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      skills: data.skills.map((s) => s.value).filter(Boolean),
      registrationDate: user?.registrationDate ?? new Date().toISOString(),
    };

    if (user) {
      await dispatch(updateUser({ ...payload, id: user.id }));
    } else {
      await dispatch(createUser(payload));
    }

    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        {user ? "Редактировать" : "Создать"} пользователя
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        <input
          {...register("firstName", { required: "Обязательно" })}
          placeholder="Имя"
          className="w-full
                     px-3 py-2
                     border border-gray-300
                     rounded-md
                     bg-white
                     text-gray-900
                     placeholder-gray-400
                     focus:outline-none
                     focus:ring-2
                     focus:ring-blue-500"
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <input
          {...register("lastName", { required: "Обязательно" })}
          placeholder="Фамилия"
          className="w-full
                     px-3 py-2
                     border border-gray-300
                     rounded-md
                     bg-white
                     text-gray-900
                     placeholder-gray-400
                     focus:outline-none
                     focus:ring-2
                     focus:ring-blue-500"
        />

        <input
          {...register("email", { required: "Email обязателен" })}
          placeholder="Email"
          className="w-full
                     px-3 py-2
                     border border-gray-300
                     rounded-md
                     bg-white
                     text-gray-900
                     placeholder-gray-400
                     focus:outline-none
                     focus:ring-2
                     focus:ring-blue-500"
        />

        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`skills.${i}.value`)}
              placeholder="Навык"
              className="w-full
                         px-3 py-2
                         border border-gray-300
                         rounded-md
                         bg-white
                         text-gray-900
                         placeholder-gray-400
                         focus:outline-none
                         focus:ring-2
                         focus:ring-blue-500
                         flex-1"
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(i)}>
                <Trash2 />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="flex"
          onClick={() => append({ value: "" })}
        >
          <Plus /> Добавить навык
        </button>

        <div className="flex gap-3">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
