import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { FIREBASE_URL } from "../firebaseConfig";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${FIREBASE_URL}.json`);
      const data = response.data;
      if (data) {
        const userList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validate = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and Email are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format.");
      return false;
    }
    return true;
  };

  const addUser = async () => {
    if (!validate()) return;
    try {
      await axios.post(`${FIREBASE_URL}.json`, {
        name: formData.name,
        email: formData.email,
      });
      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  const updateUser = async () => {
    if (!validate()) return;
    try {
      await axios.patch(`${FIREBASE_URL}/${editingId}.json`, {
        name: formData.name,
        email: formData.email,
      });
      setEditingId(null);
      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${FIREBASE_URL}/${id}.json`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateUser();
    } else {
      addUser();
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">User Management System</h1>
      <UserForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isEditing={!!editingId}
      />
      <h2 className="text-lg font-semibold mb-2">User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserManagement;
// This component handles the user management functionality including adding, editing, and deleting users.
// It uses Firebase as the backend to store user data and Axios for HTTP requests.