import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';
import { useNavigate } from 'react-router-dom';

// Read agence once from localStorage
function getUserAgenceID() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u = JSON.parse(raw);
    return typeof u?.agence === 'number' ? u.agence : null;
  } catch {
    return null;
  }
}

// --- Formulaire Projet (unchanged) ---
const ProjetForm = ({ initialData = {}, onSave, onCancel }) => {
  const [libelle, setLibelle] = useState(initialData.libelle || "");
  const [duree, setDuree] = useState(initialData.duree || "");
  const [montant_ht, setMontantHt] = useState(initialData.montant_ht || "");
  const [type, setType] = useState(initialData.type || "");
  const [numero_convention, setNumeroConvention] = useState(initialData.numero_convention || "");
  const [date_debut, setDateDebut] = useState(initialData.date_debut || "");
  const [date_fin, setDateFin] = useState(initialData.date_fin || "");
  const [entreprise, setEntreprise] = useState(typeof initialData.entreprise === "object" ? initialData.entreprise.id : initialData.entreprise || "");
  const [commune, setCommune] = useState(typeof initialData.commune === "object" ? initialData.commune.id : initialData.commune || "");
  const [exercice, setexercice] = useState(typeof initialData.exercice === "object" ? initialData.exercice.id : initialData.exercice || "");

  const [entrepriseOptions, setEntrepriseOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [exerciceOptions, setexerciceOptions] = useState([]);
  const [loadingEntreprises, setLoadingEntreprises] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [loadingExercice, setLoadingExercice] = useState(true);

  useEffect(() => {
    setLoadingEntreprises(true);
    axiosInstance.get('/feicom/api/entreprises/')
      .then(res => setEntrepriseOptions(res.data.map(item => ({ value: item.id, label: `${item.id} - ${item.nom}` }))))
      .finally(() => setLoadingEntreprises(false));
  }, []);
  useEffect(() => {
    setLoadingCommunes(true);
    axiosInstance.get('/feicom/api/communes/')
      .then(res => setCommuneOptions(res.data.map(item => ({ value: item.id, label: `${item.id} - ${item.nom}` }))))
      .finally(() => setLoadingCommunes(false));
  }, []);
  useEffect(() => {
    setLoadingExercice(true);
    axiosInstance.get('/feicom/api/exercices/')
      .then(res => setexerciceOptions(res.data.map(item => ({ value: item.id, label: `${item.id} - ${item.annee}` }))))
      .finally(() => setLoadingExercice(false));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ libelle, duree, montant_ht, type, numero_convention, date_debut, date_fin, entreprise, commune, exercice });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs ... */}
      {/* keep your form fields as you had them */}
      <div className="d-flex gap-2 mt-2">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};

// --- Modale de suppression ---
const DeleteConfirm = ({ noms, onConfirm, onCancel }) => (
  <div>
    <p>Voulez-vous vraiment supprimer {noms.length > 1 ? "les projets suivants" : "ce projet"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const ProjetTable = ({ filters = {} /* {exercice, mois} */ }) => {
  const navigate = useNavigate();
  const agenceID = getUserAgenceID(); // <-- agence comes from localStorage

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { exercice, mois } = filters || {};

  const abortRef = useRef(null);

  // -- API fetch --
  const fetchProjets = useCallback(async () => {
    setLoading(true);
    setError(null);

    // cancel in-flight
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let response;
      const hasAll = Boolean(agenceID) && Boolean(exercice) && Boolean(mois);

      if (hasAll) {
        response = await axiosInstance.get(
          `/feicom/api/filters/projects/${Number(exercice)}/${Number(agenceID)}/${Number(mois)}/`,
          { signal: controller.signal }
        );
      } else {
        // fallback to full list (backend doesn't accept wildcards)
        response = await axiosInstance.get('/feicom/api/projets/');
        setData(Array.isArray(response.data) ? response.data : []);
      }

      const payload = response.data;
      setData(Array.isArray(payload) ? payload : payload?.results ?? payload ?? []);
    } catch (err) {
      if (err?.name !== 'CanceledError') {
        setError("Erreur lors de la récupération des projets : " + (err?.message || String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, [agenceID, exercice, mois]);

  useEffect(() => {
    fetchProjets();
    return () => abortRef.current?.abort();
  }, [fetchProjets]);

  // filtering search
  const filteredData = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    if (!q) return data;
    return data.filter(row => Object.values(row || {}).join(' ').toLowerCase().includes(q));
  }, [data, searchText]);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs projets');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.libelle)}
        onConfirm={async () => {
          try {
            await Promise.all(selectedRows.map(row => axiosInstance.delete(`/feicom/api/projets/${row.id}/`)));
            setToggleDelet(v => !v);
            setModalOpen(false);
            fetchProjets();
          } catch (err) {
            setError("Erreur lors de la suppression : " + err.message);
          }
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Suppression simple
  const handleDeleteSingle = row => {
    setModalTitle('Suppression du projet');
    setModalContent(
      <DeleteConfirm
        noms={[row.libelle]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/projets/${row.id}/`);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout / Edition (unchanged)
  const handleAdd = () => {
    setModalTitle('Ajouter un projet');
    setModalContent(
      <ProjetForm
        onSave={async (payload) => {
          await axiosInstance.post('/feicom/api/projets/', payload);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };
  const handleEdit = row => {
    setModalTitle('Modifier le projet');
    setModalContent(
      <ProjetForm
        initialData={row}
        onSave={async (payload) => {
          await axiosInstance.put(`/feicom/api/projets/${row.id}/`, payload);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleRowSelected = useCallback(state => setSelectedRows(state.selectedRows), []);

  // Colonnes du tableau
  const tableColumns = [
    { name: '#', selector: (row, index) => index + 1, width: '50px', center: true },
    { name: "Libellé", selector: row => row.libelle, sortable: true, wrap: true },
    { name: "Durée", selector: row => row.duree },
    { name: "Montant HT", selector: row => row.montant_ht },
    { name: "Type", selector: row => row.type },
    { name: "Numéro convention", selector: row => row.numero_convention },
    { name: "Date début", selector: row => row.date_debut },
    { name: "Date fin", selector: row => row.date_fin },
    { name: "Entreprise", selector: row => row.entreprise },
    { name: "Commune", selector: row => row.commune },
    { name: "Exercice", selector: row => row.exercice },
    {
      name: 'Actions',
      cell: row => (
        <div className='d-flex gap-1'>
          <Btn attrBtn={{ color: 'primary', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleEdit(row) }}>
            <i className="fa fa-edit"></i>
          </Btn>
          <Btn attrBtn={{ color: 'info', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${row.id}/detail`) }}>
            <i className="fa fa-eye"></i>
          </Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleDeleteSingle(row) }}>
            <i className="fa fa-trash"></i>
          </Btn>
        </div>
      ),
      width: '140px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Projets</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Recherche"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />

      {error && <div className='alert alert-danger'>{error}</div>}

      {selectedRows.length > 0 && (
        <div className='d-flex align-items-center justify-content-between bg-light-info p-2 mb-2'>
          <H4 attrH4={{ className: 'text-muted m-0' }}>Supprimer la sélection</H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDelete }}>Supprimer</Btn>
        </div>
      )}

      <DataTable
        data={filteredData}
        columns={tableColumns}
        striped
        center
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={loading}
        noDataComponent="Aucune donnée"
      />

      <CommonModal isOpen={modalOpen} title={modalTitle} toggler={() => setModalOpen(false)}>
        {modalContent}
      </CommonModal>
    </Fragment>
  );
};

export default ProjetTable;
