import { useState } from "react";
import { Plus } from "lucide-react";
import { useUsers } from "../../hooks/users/useUsers";
import UserRow from "../../components/users/UserRow";
import AddUserModal from "../../components/users/AddUserModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: users, isLoading, isError } = useUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">الموظفين والأدمن</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={16} />
          إضافة حساب
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل الحسابات.</p>}

      {users?.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right text-text-secondary">
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">أرقام التلفون</th>
                <th className="px-4 py-3 font-medium">الإيميل</th>
                <th className="px-4 py-3 font-medium">الصلاحية</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user._id} user={user} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}