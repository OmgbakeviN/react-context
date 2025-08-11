// src/Components/ProjectDetail/index.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../api/axios'; // adapte le chemin si besoin
import ProjectProfileCard from './ProjectProfile';

const ProjectDetail = () => {
  const { id } = useParams();                         // /feicom/projets/:id/detail
  const location = useLocation();
  const seededProject = location.state?.project || null; 
  // ^ optionnel: si tu passes déjà un objet projet en state lors de la nav

  const [project, setProject] = useState(seededProject);
  const [loading, setLoading] = useState(!seededProject);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/feicom/api/projets/${id}/`);
        if (!cancelled) setProject(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // même si on a un seed, on refetch pour avoir des données fraîches
    fetchProject();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse p-6 bg-white rounded-2xl shadow">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // si ton template utilise Alert/Toast, remplace ce bloc par ton composant
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Erreur lors du chargement du projet : {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ProjectProfileCard project={project} />
      </div>
    </div>
  );
};

export default ProjectDetail;
