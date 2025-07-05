import React from "react";

function UserForm({ formData, setFormData, handleSubmit, isEditing }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Name"
        className="border p-2 w-full"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isEditing ? "Update User" : "Add User"}
      </button>
    </form>
  );
}

export default UserForm;
// This component handles the user form for adding and editing users.