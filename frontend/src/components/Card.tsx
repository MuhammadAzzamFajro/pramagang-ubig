import React from 'react';

type CardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-4xl text-blue-500">
        {icon}
      </div>
    </div>
  );
};

export default Card;