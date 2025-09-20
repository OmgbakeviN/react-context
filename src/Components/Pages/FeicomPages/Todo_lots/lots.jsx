import React, { useState } from 'react';
import TodosList from './TodosList';

const Lots = ({ lots }) => {
  const [open, setOpen] = useState('');

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  return (
    <div className="w-full space-y-3">
      {lots.map((lot) => {
        const isOpen = open === lot.id.toString();
        return (
          <div key={lot.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`
                w-full px-5 py-4 text-left font-semibold text-gray-800
                bg-gray-50 hover:bg-gray-100 transition-colors duration-200
                flex justify-between items-center
                ${isOpen ? 'border-b border-gray-200 bg-gray-100' : ''}
              `}
              onClick={() => toggle(lot.id.toString())}
              aria-expanded={isOpen}
            >
              <span>{lot.nom} 
                {/* on mets des badges de couleur */}
                {lot.statut === 'STARTED' && <span className="badge bg-success">Started</span>}
                {lot.statut === 'PLANNED' && <span className="badge bg-warning">Planned</span>}
                {lot.statut === 'COMPLETED' && <span className="badge bg-success">Completed</span>}
                </span>
              <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {isOpen && (
              <div className="p-1 bg-white border-t border-gray-200">
                <TodosList todos={lot.todos} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Lots;