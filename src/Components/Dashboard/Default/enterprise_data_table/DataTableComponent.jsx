import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEntreprises,
  createEntreprise,
  updateEntreprise,
  deleteEntreprise,
  deleteManyEntreprises,
  selectEntreprises,
  selectEntreprisesLoading,
  selectEntreprisesError
} from '../../../../reduxtool/entreprisesSlice';

// --- Formulaire entreprise ---
const EntrepriseForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  const [rcc, setRcc] = useState(initialData.rcc || "");
  const [niu, setNiu] = useState(initialData.niu || "");
  const [promoteur, setPromoteur] = useState(initialData.promoteur || "");
  const [contact, setContact] = useState(initialData.contact || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [siege_social, setSiegeSocial] = useState(initialData.siege_social || "");

  useEffect(() => {
    setNom(initialData.nom || "");
    setRcc(initialData.rcc || "");
    setNiu(initialData.niu || "");
    setPromoteur(initialData.promoteur || "");
    setContact(initialData.contact || "");
    setEmail(initialData.email || "");
    setSiegeSocial(initialData.siege_social || "");
  }, [initialData.id]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ nom, rcc, niu, promoteur, contact, email, siege_social });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Nom</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>RCC</label>
        <input className="form-control" value={rcc} onChange={e => setRcc(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>NIU</label>
        <input className="form-control" value={niu} onChange={e => setNiu(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Promoteur</label>
        <input className="form-control" value={promoteur} onChange={e => setPromoteur(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Contact</label>
        <input className="form-control" value={contact} onChange={e => setContact(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Email</label>
        <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Siège social</label>
        <input className="form-control" value={siege_social} onChange={e => setSiegeSocial(e.target.value)} required />
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les entreprises suivantes" : "l'entreprise suivante"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const EntrepriseTable = () => {

  const dispatch = useDispatch();

  // redux state
  const items = useSelector(selectEntreprises);
  const loading = useSelector(selectEntreprisesLoading);
  const error = useSelector(selectEntreprisesError);

  // ui local state
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [searchText,setSearchText] = useState()

  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // fetch on mount 
  useEffect(() => {
    dispatch(fetchEntreprises());
  }, [dispatch]);

  // search filtering
  const filteredData = useMemo(() => {
    const q = searchText?.toLowerCase().trim();
    if (!q) return items;
    return (items || []).filter(row =>
      // Object.values(row || {}).join(' ').toLowerCase().includes(q)
      row.nom?.toLowerCase().includes(q) ||
      row.rcc?.toLowerCase().includes(q) ||
      row.niu?.toLowerCase().includes(q) ||
      row.promoteur?.toLowerCase().includes(q) ||
      row.contact?.toLowerCase().includes(q) ||
      row.email?.toLowerCase().includes(q) ||
      row.siege_social?.toLowerCase().includes(q)
    );
  }, [items, searchText]);

  // CRUD UI

  // add entreprise
  const handleAdd = () => {
    setModalTitle('Ajouter une entreprise');
    setModalContent(
      <EntrepriseForm
        onSave={async (form) => {
          await dispatch(createEntreprise(form)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // edit entreprise
  const handleEdit = (row) => {
    setModalTitle('Modifier l\'entreprise');
    setModalContent(
      <EntrepriseForm
        initialData={row}
        onSave={async (form) => {
          await dispatch(updateEntreprise({ id: row.id, data: form })).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // supprimer une entreprise
  const handleDeleteSingle = (row) => {
    setModalTitle('Suppression de l\'entreprise');
    setModalContent(
      <DeleteConfirm
        noms={[row.nom]}
        onConfirm={async () => {
          await dispatch(deleteEntreprise(row.id)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // supprimer plusieurs entreprises
  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs entreprises');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.nom)}
        onConfirm={async () => {
          await dispatch(deleteManyEntreprises(selectedRows.map(r => r.id))).unwrap();
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

  // Colonnes du tableau
  const tableColumns = [
    { name: "Nom", selector: row => row.nom, sortable: true },
    { name: "RCC", selector: row => row.rcc, sortable: true },
    { name: "NIU", selector: row => row.niu, sortable: true },
    { name: "Promoteur", selector: row => row.promoteur, sortable: true },
    { name: "Contact", selector: row => row.contact, sortable: true },
    { name: "Email", selector: row => row.email, sortable: true },
    { name: "Siège social", selector: row => row.siege_social, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div className='d-flex gap-1'>
          <Btn attrBtn={{ 
            color: 'primary', 
            size: 'sm', 
            className: 'btn-sm py-1 px-2', 
            onClick: () => handleEdit(row) 
          }}>
            <i className="fa fa-edit"></i>
          </Btn>
          <Btn attrBtn={{ 
            color: 'danger', 
            size: 'sm', 
            className: 'btn-sm py-1 px-2', 
            onClick: () => handleDeleteSingle(row) 
          }}>
            <i className="fa fa-trash"></i>
          </Btn>
        </div>
      ),
      width: '120px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Entreprises</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>

      <input type="text" className="form-control mb-2" placeholder="Recherche" onChange={e => setSearchText(e.target.value)} />

      {error && <div className='alert alert-danger'>{error}</div>}
      {selectedRows.length > 0 && (
        <div className='d-flex align-items-center justify-content-between bg-light-info p-2 mb-2'>
          <H4 attrH4={{ className: 'text-muted m-0' }}>Supprimer la sélection ({selectedRows.length})</H4>
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

export default EntrepriseTable;
