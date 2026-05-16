import React, { useEffect, useState } from "react";
import {
  deleteAdminUser,
  fetchAdminUsers,
  toggleAdminUserBlock,
  updateAdminUserRole,
} from "../../api/adminApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "object" && image.url) {
      return image.url;
    }

    const img = String(image);

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    if (img.startsWith("/uploads")) {
      return `${API_BASE_URL}${img}`;
    }

    if (img.startsWith("/")) {
      return img;
    }

    return `${API_BASE_URL}/uploads/${img}`;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await fetchAdminUsers();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        setUsers([]);
        setMessage(data.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Admin users fetch error:", error);

      setUsers([]);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserName = (user) => {
    return (
      user.displayName ||
      user.fullName ||
      user.name ||
      user.username ||
      user.email?.split("@")[0] ||
      "No Name"
    );
  };

  const getUserImage = (user) => {
    return getImageUrl(
      user.profileImage ||
        user.profilePic ||
        user.avatar ||
        user.image ||
        user.photoURL ||
        user.picture,
    );
  };

  const getInitial = (name) => {
    return String(name || "U")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const data = await updateAdminUserRole(userId, role);

      if (data.success) {
        setMessage("User role updated successfully.");
        await loadUsers();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Role update failed.",
      );
    }
  };

  const handleBlockToggle = async (userId) => {
    try {
      const data = await toggleAdminUserBlock(userId);

      if (data.success) {
        setMessage(data.message || "User status updated.");
        await loadUsers();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "User status update failed.",
      );
    }
  };

  const handleDelete = async (userId) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      const data = await deleteAdminUser(userId);

      if (data.success) {
        setMessage("User deleted successfully.");
        await loadUsers();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "User delete failed.",
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Users</h1>
          <p className="text-slate-600 mt-2">
            Total registered users: {users.length}
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 text-orange-600 px-4 py-3">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          {loading ? (
            <p className="text-slate-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const userName = getUserName(user);
                    const userImage = getUserImage(user);

                    return (
                      <tr key={user._id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 text-orange-600 flex items-center justify-center font-bold border">
                              {userImage ? (
                                <img
                                  src={userImage}
                                  alt={userName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getInitial(userName)
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {userName}
                              </p>
                              <p className="text-xs text-slate-500">
                                ID: {user._id?.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">{user.email || "-"}</td>

                        <td className="p-4">{user.phone || "-"}</td>

                        <td className="p-4">
                          <select
                            value={user.role || "customer"}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="border rounded-lg px-3 py-2 bg-white"
                          >
                            <option value="customer">customer</option>
                            <option value="user">user</option>
                            <option value="vendor">vendor</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>

                        <td className="p-4">
                          {user.isBlocked ? (
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                              Blocked
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-4">{formatDate(user.createdAt)}</td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleBlockToggle(user._id)}
                              className={`px-4 py-2 rounded-lg text-white ${
                                user.isBlocked
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              }`}
                            >
                              {user.isBlocked ? "Unblock" : "Block"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(user._id)}
                              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center p-8 text-slate-500"
                      >
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
