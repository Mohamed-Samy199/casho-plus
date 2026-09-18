import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TransactionsPage from "../pages/transactions/TransactionsPage";
import PartnersPage from "../pages/partners/PartnersPage";
import PartnerDetailPage from "../pages/partners/PartnerDetailPage";
import IndividualsPage from "../pages/clients/IndividualsPage";
import KeyClientsPage from "../pages/clients/KeyClientsPage";
import ClientDetailPage from "../pages/clients/ClientDetailPage";
import DebtsPage from "../pages/debts/DebtsPage";
import CapitalPage from "../pages/capital/CapitalPage";
import CommissionRulesPage from "../pages/settings/CommissionRulesPage";
import UsersPage from "../pages/users/UsersPage";
import ProfilePage from "../pages/settings/ProfilePage";
import AttendancePage from "../pages/attendance/AttendancePage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/Homepage";
// import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/clients/individuals", element: <IndividualsPage /> },
          { path: "/clients/key-clients", element: <KeyClientsPage /> },
          { path: "/clients/:id", element: <ClientDetailPage /> },
          { path: "/debts", element: <DebtsPage /> },
          // الشركاء متاحين للموظف والأدمن (الإضافة/التعديل بس أدمن، متحكم فيه جوه الصفحة نفسها)
          { path: "/partners", element: <PartnersPage /> },
          { path: "/partners/:id", element: <PartnerDetailPage /> },
          // الإعدادات الشخصية والحضور/الانصراف متاحة للكل
          { path: "/settings/profile", element: <ProfilePage /> },
          { path: "/attendance", element: <AttendancePage /> },
          // رأس المال، قواعد العمولة، وإدارة الموظفين — أدمن بس
          {
            element: <AdminRoute />,
            children: [
              { path: "/capital", element: <CapitalPage /> },
              { path: "/settings/commission-rules", element: <CommissionRulesPage /> },
              { path: "/users", element: <UsersPage /> },
            ],
          },
        ],
      },
    ],
  },
]);