import React from 'react';

const ProjectProfileCard = ({ project }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">Project Details</h1>
          <p className="text-gray-500">ID: {project.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Created: {project.date_debut}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-4">
          <InfoBox title="Project Label" value={project.libelle} />
          <InfoBox title="Project Type" value={project.type} />
          <InfoBox title="Convention Number" value={project.numero_convention} />
          <InfoBox title="Duration (days)" value={project.duree} />
        </div>


        <div className="space-y-4">
          <InfoBox title="Amount HT" value={`${project.montant_ht} FCFA`} />
          <InfoBox title="Enterprise ID" value={project.entreprise} />
          <InfoBox title="Commune ID" value={project.commune} />
          <InfoBox title="Exercise ID" value={project.exercice} />
        </div>
      </div>

      {/* Dates Section */}
      <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">Project Timeline</h2>
        <div className="flex flex-wrap justify-between">
          <DateBox label="Start Date" date={project.date_debut} />
          <DateBox label="End Date" date={project.date_fin} />
        </div>
      </div>
    </div>
  );
};


const InfoBox = ({ title, value }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-lg font-semibold text-gray-800">{value || '-'}</p>
  </div>
);


const DateBox = ({ label, date }) => (
  <div className="w-full sm:w-auto mb-2 sm:mb-0">
    <p className="text-sm text-indigo-600">{label}</p>
    <p className="text-base font-medium text-gray-800">{date}</p>
  </div>
);

export default ProjectProfileCard;