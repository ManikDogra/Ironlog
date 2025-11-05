import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function PageHeader({ title }) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <Link to="/dashboard" className="inline-flex items-center justify-center w-9 h-9 border rounded-md hover:bg-gray-100">
        <Home className="w-5 h-5" />
      </Link>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
    </div>
  );
}
