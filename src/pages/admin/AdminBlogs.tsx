import React from 'react';

const AdminBlogs = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Create & Manage Blogs</h1>
    <button className="mb-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Create New Blog</button>
    <div className="bg-white rounded shadow p-4">
      {/* Blogs table/list placeholder */}
      <p className="text-gray-500">Blogs list will appear here.</p>
    </div>
  </div>
);

export default AdminBlogs; 