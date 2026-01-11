import {useEffect, useState} from "react";
import {UserForm} from "../../features/user-form/UserForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, fetchUsers,} from "../../entities/user/model/usersThunks.ts";
import {setPage} from "../../entities/user/model/usersSlice.ts";
import type {User} from "../../entities/user/model/types.ts";
import type {AppDispatch, RootState} from "../../app/store.ts";
import {ChevronLeft, ChevronRight, Edit, Plus, Trash2} from "lucide-react";

const UserTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.users,
  );

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
      await dispatch(deleteUser(id));
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  if (editingUser) {
    return (
      <UserForm
        user={editingUser}
        onSubmit={() => setEditingUser(null)}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  if (showAddForm) {
    return (
      <UserForm
        onSubmit={() => setShowAddForm(false)}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex gap-[15px] justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить пользователя
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {user.firstName} {user.lastName}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-gray-700">
                        <strong>Email:</strong> {user.email}
                      </div>

                      <div className="text-sm text-gray-600">
                        Зарегистрирован:{" "}
                        {new Date(user.registrationDate).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Навыки:
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Показано {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, users.length)} из{" "}
                {users.length}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(setPage(currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => dispatch(setPage(page))}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => dispatch(setPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserTable;
