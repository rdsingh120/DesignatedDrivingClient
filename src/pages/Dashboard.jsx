import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");

    setTimeout(() => {
      toast.success("Logged out successfully 👋");
      navigate("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Designated Driving App</h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
          <User className="mx-auto mb-4 text-blue-600" size={40} />

          <h2 className="text-2xl font-bold mb-2">Welcome, {userInfo?.name} 👋</h2>

          <p className="text-gray-600">
            Role: <span className="font-semibold capitalize">{userInfo?.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
