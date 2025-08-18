import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';

// --- Formulaire commune ---
const CommuneForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  const [departement, setDepartement] = useState(
    typeof initialData.departement === "object"
      ? initialData.departement.id
      : initialData.departement || ""
  );
  const [departementOptions, setDepartementOptions] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  // Récupérer la liste des départements pour le select
  useEffect(() => {
    setLoadingDeps(true);
    axiosInstance.get('/feicom/api/departements/')
      .then(res => {
        const options = res.data.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.nom}`
        }));
        setDepartementOptions(options);
      })
      .finally(() => setLoadingDeps(false));
  }, []);

  const selectedDep = departementOptions.find(opt => opt.value === departement) || null;

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ nom, departement });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Nom de la Commune</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Département</label>
        <select
          className="form-control"
          value={departement}
          onChange={e => setDepartement(Number(e.target.value))}
          required
          disabled={loadingDeps}
        >
          <option value="">Sélectionnez un département</option>
          {departementOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="d-flex gap-2">
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les communes suivantes" : "la commune suivante"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const CommuneTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // API fetch
  const fetchCommunes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/communes/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des communes : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // filtering search
  const filteredData = data.filter(row => 
    Object.values(row).join(' ').toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchCommunes();
  }, []);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs communes');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.nom)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedRows.map(row =>
                axiosInstance.delete(`/feicom/api/communes/${row.id}/`)
              )
            );
            setToggleDelet(!toggleDelet);
            setModalOpen(false); 
            fetchCommunes();
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
    setModalTitle('Suppression de la commune');
    setModalContent(
      <DeleteConfirm
        noms={[row.nom]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/communes/${row.id}/`);
          setModalOpen(false);
          fetchCommunes();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter une commune');
    setModalContent(
      <CommuneForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/communes/', data);
          setModalOpen(false);
          fetchCommunes();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier la commune');
    setModalContent(
      <CommuneForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/communes/${row.id}/`, data);
          setModalOpen(false);
          fetchCommunes();
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
    {
      name: '#',
      selector: (row, index) => index + 1,
      width: '50px',
      center: true,
    },
    {
      name: "Nom de la Commune",
      selector: row => row.nom,
      sortable: true,
    },
    {
      name: "Département",
      selector: row => row.departement,
      sortable: true,
    },
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
    }
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Communes</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>

      <input type="text" className="form-control mb-2" placeholder="Recherche" onChange={e => setSearchText(e.target.value)} />

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

export default CommuneTable;
