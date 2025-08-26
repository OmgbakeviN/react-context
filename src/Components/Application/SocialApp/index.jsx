// src/Components/ProjectDetail/index.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../api/axios';
import ProjectPage from '../../Pages/FeicomPages/ProjectPage'; // le default export

const ProjectDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const seededProject = state?.project ?? null;

  const [project, setProject]   = useState(seededProject);
  const [loading, setLoading]   = useState(!seededProject);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/feicom/api/projets/${id}/`);
        if (!cancelled) setProject(res.data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data || err?.message || 'Erreur inconnue');
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
          <div className="p-6 bg-white rounded-2xl shadow">
            Chargement du projet…
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Erreur lors du chargement du projet : {String(error || 'Projet introuvable')}
          </div>
        </div>
      </div>
    );
  }

  return <ProjectPage project={project} />;
};

export default ProjectDetail;
