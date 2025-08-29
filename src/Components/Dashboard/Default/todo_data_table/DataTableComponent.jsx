import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';

// --- Formulaire todo ---
const TodoForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  const [pourcentage, setPourcentage] = useState(initialData.pourcentage || "");
  const [statut, setStatut] = useState(initialData.statut || "");
  const [lot, setLot] = useState(
    typeof initialData.lot === "object"
      ? initialData.lot.id
      : initialData.lot || ""
  );
  const [lotOptions, setLotOptions] = useState([]);
  const [loadingLots, setLoadingLots] = useState(false);

  // Charger les lots pour le select
  useEffect(() => {
    setLoadingLots(true);
    axiosInstance.get('/feicom/api/lots/')
      .then(res => {
        const options = res.data.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.nom}`
        }));
        setLotOptions(options);
      })
      .finally(() => setLoadingLots(false));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ nom, pourcentage, statut, lot });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Nom</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Pourcentage</label>
        <input className="form-control" type="number" step="0.1" value={pourcentage} onChange={e => setPourcentage(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Statut</label>
        <input className="form-control" value={statut} onChange={e => setStatut(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Lot</label>
        <select
          className="form-control"
          value={lot}
          onChange={e => setLot(Number(e.target.value))}
          required
          disabled={loadingLots}
        >
          <option value="">Sélectionnez un lot</option>
          {lotOptions.map(opt => (
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les todos suivants" : "ce todo"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const TodoTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // -- API fetch --
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/todos/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des todos : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // filtering search
  const filteredData = data.filter(row => 
    Object.values(row).join(' ').toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs todos');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.nom)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedRows.map(row =>
                axiosInstance.delete(`/feicom/api/todos/${row.id}/`)
              )
            );
            setToggleDelet(!toggleDelet);
            setModalOpen(false); 
            fetchTodos();
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
    setModalTitle('Suppression du todo');
    setModalContent(
      <DeleteConfirm
        noms={[row.nom]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/todos/${row.id}/`);
          setModalOpen(false);
          fetchTodos();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter un todo');
    setModalContent(
      <TodoForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/todos/', data);
          setModalOpen(false);
          fetchTodos();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier le todo');
    setModalContent(
      <TodoForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/todos/${row.id}/`, data);
          setModalOpen(false);
          fetchTodos();
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
    { name: '#', selector: (row, index) => index + 1, width: '50px', center: true },
    { name: "Nom", selector: row => row.nom, sortable: true },
    { name: "Statut", selector: row => row.statut ,
      // on affiche la couleur de la cellule seulon le statut STARTED, NOT STARTED, COMPLETED
      cell: row => (
        <span className={`badge badge-${row.statut === 'STARTED' ? 'success' : row.statut === 'NOT STARTED' ? 'warning' : row.statut === 'COMPLETED' ? 'info' : 'secondary'}`}>          
          {row.statut}
        </span>
      ),
      sortable: true,

    },
    { name: "Lot", selector: row => row.lot, sortable: true }, // affiche l'id du lot (tu peux mapper le nom si besoin)
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
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Todos</H4>
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

export default TodoTable;
