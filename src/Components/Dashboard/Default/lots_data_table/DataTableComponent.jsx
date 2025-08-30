import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axiosInstance from '../../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchLots,
  createLot,
  updateLot,
  deleteLot,
  deleteManyLots,
  selectLots,
  selectLotsLoading,
  selectLotsError,
} from '../../../../reduxtool/lotsSlice';

// --- Formulaire lot ---
const LotForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  const [pourcentage, setPourcentage] = useState(initialData.pourcentage || "");
  const [statut, setStatut] = useState(initialData.statut || "");
  const [projet, setProjet] = useState(
    typeof initialData.projet === "object" ? initialData.projet.id : (initialData.projet || "")
  );

  const [projetOptions, setProjetOptions] = useState([]);
  const [loadingProjets, setLoadingProjets] = useState(false);

  // Charger les projets pour le select
  useEffect(() => {
    (async () => {
      setLoadingProjets(true);
      try {
        const res = await axiosInstance.get('/feicom/api/projets/');
        const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        // NOTE: l'API projet expose 'libelle' (et pas 'nom')
        const options = list.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.libelle}`,
        }));
        setProjetOptions(options);
      } finally {
        setLoadingProjets(false);
      }
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // assure qu'on envoie bien un number pour projet si dispo
    const payload = { nom, pourcentage, statut, projet: projet ? Number(projet) : "" };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Nom du lot</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Pourcentage</label>
        <input className="form-control" type="number" step="0.1" value={pourcentage} onChange={e => setPourcentage(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Statut</label>
        <select className="form-control" value={statut} onChange={e => setStatut(e.target.value)} required>
          <option value="">Sélectionnez…</option>
          <option value="NOT STARTED">NOT STARTED</option>
          <option value="STARTED">STARTED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Projet</label>
        <select
          className="form-control"
          value={projet}
          onChange={e => setProjet(Number(e.target.value))}
          required
          disabled={loadingProjets}
        >
          <option value="">Sélectionnez un projet</option>
          {projetOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="d-flex gap-2 mt-2">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};

// --- Modale de suppression multiple/simple ---
const DeleteConfirm = ({ noms, onConfirm, onCancel }) => (
  <div>
    <p>
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les lots suivants" : "le lot suivant"} ?
      <br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const LotTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const items   = useSelector(selectLots);
  const loading = useSelector(selectLotsLoading);
  const error   = useSelector(selectLotsError);

  // UI local
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet]   = useState(false);
  const [searchText, setSearchText]     = useState('');

  const [modalOpen, setModalOpen]     = useState(false);
  const [modalTitle, setModalTitle]   = useState('');
  const [modalContent, setModalContent] = useState(null);

  // Fetch init
  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  // Recherche locale
  const filteredData = useMemo(() => {
    const q = searchText?.trim().toLowerCase();
    if (!q) return items || [];
    return (items || []).filter(row =>
      Object.values(row || {}).join(' ').toLowerCase().includes(q)
    );
  }, [items, searchText]);

  // CRUD
  const handleAdd = () => {
    setModalTitle('Ajouter un lot');
    setModalContent(
      <LotForm
        onSave={async (form) => {
          await dispatch(createLot(form)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalTitle('Modifier le lot');
    setModalContent(
      <LotForm
        initialData={row}
        onSave={async (form) => {
          await dispatch(updateLot({ id: row.id, data: form })).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteSingle = (row) => {
    setModalTitle('Suppression du lot');
    setModalContent(
      <DeleteConfirm
        noms={[row.nom]}
        onConfirm={async () => {
          await dispatch(deleteLot(row.id)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs lots');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.nom)}
        onConfirm={async () => {
          await dispatch(deleteManyLots(selectedRows.map(r => r.id))).unwrap();
          setToggleDelet(v => !v);
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  // Helpers UI
  const statusBadgeClass = (statut) => {
    if (statut === 'STARTED') return 'success';
    if (statut === 'NOT STARTED') return 'warning';
    if (statut === 'COMPLETED') return 'info';
    return 'secondary';
  };

  // Colonnes
  const tableColumns = [
    { name: '#', selector: (row, index) => index + 1, width: '60px', center: true },
    { name: 'Nom', selector: row => row.nom, sortable: true },
    {
      name: 'Statut',
      selector: row => row.statut,
      cell: row => (
        <span className={`badge badge-${statusBadgeClass(row.statut)}`}>
          {row.statut}
        </span>
      )
    },
    {
      name: 'Projet',
      selector: row => (
        typeof row.projet === 'object'
          ? (row.projet.libelle ?? row.projet.id)
          : row.projet // id si pas d'objet
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      width: '140px',
      cell: row => (
        <div className='d-flex gap-1'>
          <Btn attrBtn={{ color: 'primary', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleEdit(row) }}>
            <i className="fa fa-edit"></i>
          </Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleDeleteSingle(row) }}>
            <i className="fa fa-trash"></i>
          </Btn>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Lots</H4>
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
          <H4 attrH4={{ className: 'text-muted m-0' }}>
            Supprimer la sélection ({selectedRows.length})
          </H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDeleteMany }}>Supprimer</Btn>
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

export default LotTable;
