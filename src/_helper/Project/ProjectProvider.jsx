import React, { useEffect, useState } from 'react';
import Context from './index';
import axiosInstance from '../../api/axios';
import { AllProjectApi } from '../../api';

const ProjectProvider = (props) => {
    const [allData, setAllData] = useState([]);
    const [project, setProject] = useState([]);

    const getAllProjectData = async () => {
        try {
            await axiosInstance.get(AllProjectApi).then((resp) => {
                setAllData(resp.data);
            });
        } catch (error) {
            console.log('cancelled', error);
        }
    };

    useEffect(() => {
        getAllProjectData();
    }, [setAllData, setProject]);

    const addNewProject = (projectData) => {
        const projectTemp = {
            id: projectData.id,
            libelle: projectData.libelle,
            duree: projectData.duree,
            montant_ht: projectData.montant_ht,
            type: projectData.type,
            numero_convention: projectData.numero_convention,
            date_debut: projectData.date_debut,
            date_fin: projectData.date_fin,
            entreprise: projectData.entreprise,
            commune: projectData.commune,
            exercice: projectData.exercice
        };
        setAllData([...allData, projectTemp]);
    };

    return (
        <Context.Provider
            value={{
                ...props,
                addNewProject: addNewProject,
                project,
                allData,
            }}
        >
            {props.children}
        </Context.Provider>
    );
};

export default ProjectProvider;