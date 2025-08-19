import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';
import { useNavigate } from 'react-router';
import {
  Dropdown, DropdownToggle, DropdownMenu,
  Input, Button, Spinner, Label
} from 'reactstrap';


const CommuneSelect = ({
  options = [],           // [{value,label}]
  value = '',             // number | '' (toutes)
  onChange,               // (newValue)=>void
  placeholder = '-- Toutes les communes --',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter(o => o.label.toLowerCase().includes(s));
  }, [options, q]);

  const label = useMemo(() => {
    const found = options.find(o => o.value === value);
    return found ? found.label : placeholder;
  }, [options, value, placeholder]);

  const selectItem = (val) => {
    onChange?.(val);
    setOpen(false);
    setQ('');
  };

  return (
    <Dropdown isOpen={open} toggle={() => setOpen(!open)} disabled={disabled}>
      <DropdownToggle caret color="light" className="w-100 text-start">
        {label}
      </DropdownToggle>
      <DropdownMenu className="p-2" style={{ width: 320 }}>
        <Input
          type="text"
          bsSize="sm"
          placeholder="Search a sub-division"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mb-2"
        />
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          <Button
            color={value === '' ? 'primary' : 'light'}
            outline={value !== ''}
            className="w-100 text-start mb-1"
            onClick={() => selectItem('')}
          >
            {placeholder}
          </Button>
          {filtered.length === 0 ? (
            <div className="text-muted small px-1 py-2">No results found…</div>
          ) : (
            filtered.map(opt => (
              <Button
                key={opt.value}
                color={value === opt.value ? 'primary' : 'light'}
                outline={value !== opt.value}
                className="w-100 text-start mb-1"
                onClick={() => selectItem(opt.value)}
              >
                {opt.label}
              </Button>
            ))
          )}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

/*  Formulaire Projet */
const ProjetForm = ({ initialData = {}, onSave, onCancel }) => {
  const [libelle, setLibelle] = useState(initialData.libelle || "");
  const [duree, setDuree] = useState(initialData.duree || "");
  const [montant_ht, setMontantHt] = useState(initialData.montant_ht || "");
  const [type, setType] = useState(initialData.type || "");
  const [numero_convention, setNumeroConvention] = useState(initialData.numero_convention || "");
  const [date_debut, setDateDebut] = useState(initialData.date_debut || "");
  const [date_fin, setDateFin] = useState(initialData.date_fin || "");
  const [entreprise, setEntreprise] = useState(
    typeof initialData.entreprise === "object" ? initialData.entreprise?.id : initialData.entreprise || ""
  );
  const [commune, setCommune] = useState(
    typeof initialData.commune === "object" ? initialData.commune?.id : initialData.commune || ""
  );
  const [exercice, setExercice] = useState(
    typeof initialData.exercice === "object" ? initialData.exercice?.id : initialData.exercice || ""
  );

  const [entrepriseOptions, setEntrepriseOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [loadingEntreprises, setLoadingEntreprises] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [loadingExercice, setLoadingExercice] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadingEntreprises(true);
      try {
        const res = await axiosInstance.get('/feicom/api/entreprises/');
        const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
          .map(it => ({ value: it.id, label: `${it.id} - ${it.nom}` }));
        setEntrepriseOptions(opts);
      } finally {
        setLoadingEntreprises(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingCommunes(true);
      try {
        const res = await axiosInstance.get('/feicom/api/communes/');
        const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
          .map(it => ({ value: it.id, label: `${it.id} - ${it.nom}` }));
        setCommuneOptions(opts);
      } finally {
        setLoadingCommunes(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingExercice(true);
      try {
        const res = await axiosInstance.get('/feicom/api/exercices/');
        const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
          .map(it => ({ value: it.id, label: `${it.id} - ${it.annee}` }));
        setExerciceOptions(opts);
      } finally {
        setLoadingExercice(false);
      }
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      libelle, duree, montant_ht, type,
      numero_convention, date_debut, date_fin,
      entreprise, commune, exercice
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-md-6">
          <Label>Libellé</Label>
          <input className="form-control" value={libelle} onChange={e => setLibelle(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <Label>Durée</Label>
          <input className="form-control" type="number" value={duree} onChange={e => setDuree(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <Label>Montant HT</Label>
          <input className="form-control" type="number" value={montant_ht} onChange={e => setMontantHt(e.target.value)} required />
        </div>

        <div className="col-md-4">
          <Label>Type</Label>
          <select className="form-control" value={type} onChange={e => setType(e.target.value)} required>
            <option value="">Sélectionnez un type</option>
            <option value="INFRA">INFRA</option>
            <option value="ETUDE">ETUDE</option>
          </select>
        </div>
        <div className="col-md-4">
          <Label>Numéro de convention</Label>
          <input className="form-control" value={numero_convention} onChange={e => setNumeroConvention(e.target.value)} required />
        </div>
        <div className="col-md-2">
          <Label>Date de début</Label>
          <input className="form-control" type="date" value={date_debut} onChange={e => setDateDebut(e.target.value)} required />
        </div>
        <div className="col-md-2">
          <Label>Date de fin</Label>
          <input className="form-control" type="date" value={date_fin} onChange={e => setDateFin(e.target.value)} required />
        </div>

        <div className="col-md-4">
          <Label>Entreprise</Label>
          <select
            className="form-control"
            value={entreprise}
            onChange={e => setEntreprise(Number(e.target.value))}
            required
            disabled={loadingEntreprises}
          >
            <option value="">Sélectionnez une entreprise</option>
            {entrepriseOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <Label>Commune</Label>
          <select
            className="form-control"
            value={commune}
            onChange={e => setCommune(Number(e.target.value))}
            required
            disabled={loadingCommunes}
          >
            <option value="">Sélectionnez une commune</option>
            {communeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <Label>Exercice</Label>
          <select
            className="form-control"
            value={exercice}
            onChange={e => setExercice(Number(e.target.value))}
            required
            disabled={loadingExercice}
          >
            <option value="">Sélectionnez un exercice</option>
            {exerciceOptions.map ? null : null}
            {exerciceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};
/* ================================================================================================ */

const DeleteConfirm = ({ noms, onConfirm, onCancel }) => (
  <div>
    <p>Voulez-vous vraiment supprimer {noms.length > 1 ? "les projets suivants" : "ce projet"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const ProjetTable = () => {
  const navigate = useNavigate();

  // data & states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [filters, setFilters] = useState({ exercice: '', commune: '' });

  // search
  const [searchText, setSearchText] = useState('');

  // selection / modal
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  // load options
  useEffect(() => {
    (async () => {
      try {
        const [exRes, comRes] = await Promise.all([
          axiosInstance.get('/feicom/api/exercices/'),
          axiosInstance.get('/feicom/api/communes/'),
        ]);
        const exOpts = (Array.isArray(exRes.data) ? exRes.data : (exRes.data?.results ?? []))
          .map(e => ({ value: e.id, label: String(e.annee) }));
        const comOpts = (Array.isArray(comRes.data) ? comRes.data : (comRes.data?.results ?? []))
          .map(c => ({ value: c.id, label: c.nom }));
        setExerciceOptions(exOpts);
        setCommuneOptions(comOpts);
      } catch (e) {
        console.error('Erreur chargement options', e);
      }
    })();
  }, []);

  // load data
  const fetchProjets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/feicom/api/projets/');
      const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setData(list);
    } catch (e) {
      setError('Erreur lors de la récupération des projets : ' + (e?.message || ''));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchProjets(); }, []);

  // filtered
  const filteredData = useMemo(() => {
    let out = Array.isArray(data) ? data : [];
    if (filters.exercice) {
      out = out.filter(r => (typeof r.exercice === 'object' ? r.exercice?.id : r.exercice) === filters.exercice);
    }
    if (filters.commune !== '') {
      out = out.filter(r => (typeof r.commune === 'object' ? r.commune?.id : r.commune) === filters.commune);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      out = out.filter(r => Object.values(r || {}).join(' ').toLowerCase().includes(q));
    }
    return out;
  }, [data, filters, searchText]);

  // CRUD
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

  const handleEdit = (row) => {
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

  const handleDeleteSingle = (row) => {
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

  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs projets');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.libelle)}
        onConfirm={async () => {
          await Promise.all(selectedRows.map(r => axiosInstance.delete(`/feicom/api/projets/${r.id}/`)));
          setToggleDelet(v => !v);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // columns
  const columns = [
    { name: '#', selector: (row, i) => i + 1, width: '60px', center: true },
    { name: 'Libellé', selector: r => r.libelle, sortable: true, wrap: true },
    { name: 'Durée', selector: r => r.duree },
    { name: 'Montant HT', selector: r => r.montant_ht },
    { name: 'Type', selector: r => r.type },
    { name: 'Numéro convention', selector: r => r.numero_convention, wrap: true },
    { name: 'Date début', selector: r => r.date_debut },
    { name: 'Date fin', selector: r => r.date_fin },
    { name: 'Entreprise', selector: r => r.entreprise },
    { name: 'Commune', selector: r => (typeof r.commune === 'object' ? r.commune?.nom : r.commune) },
    { name: 'Exercice', selector: r => (typeof r.exercice === 'object' ? r.exercice?.annee : r.exercice) },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          <Btn attrBtn={{ color: 'primary', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleEdit(row) }}>
            <i className="fa fa-edit" />
          </Btn>
          <Btn attrBtn={{ color: 'info', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => navigate(`${process.env.PUBLIC_URL}/pages/FeicomPages/ProjectPage/SingleProject/${row.id}/detail`) }}>
            <i className="fa fa-eye" />
          </Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleDeleteSingle(row) }}>
            <i className="fa fa-trash" />
          </Btn>
        </div>
      ),
      width: '150px',
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex justify-end m-3">
        <Btn attrBtn={{ color: 'primary', onClick: handleAdd }}>Add Project</Btn>
      </div>

      {/* Filtres */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        {/* Exercice */}
        <select
          className="form-select"
          style={{ maxWidth: 260 }}
          value={filters.exercice}
          onChange={e => setFilters(f => ({ ...f, exercice: e.target.value ? Number(e.target.value) : '' }))}
        >
          <option value="">-- Tous les exercices --</option>
          {exerciceOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>


        {/* Commune avec recherche */}
        <div style={{ width: 320 }}>
          {communeOptions.length === 0 ? (
            <Button color="light" className="w-100" disabled>
              <Spinner size="sm" className="me-2" /> Chargement des communes…
            </Button>
          ) : (
            <CommuneSelect
              options={communeOptions}
              value={filters.commune}
              onChange={(v) => setFilters(f => ({ ...f, commune: v === '' ? '' : Number(v) }))}
              placeholder="-- Toutes les communes --"
            />
          )}
        </div>

        {/* Recherche globale */}
        <input
          type="text"
          className="form-control"
          style={{ minWidth: 260 }}
          placeholder="Recherche…"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Alerte suppression multiple */}
      {selectedRows.length > 0 && (
        <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-2">
          <div className="text-muted">Sélection : {selectedRows.length} projet(s)</div>
          <Btn attrBtn={{ color: 'danger', onClick: handleDeleteMany }}>Supprimer la sélection</Btn>
        </div>
      )}

      <DataTable
        data={filteredData}
        columns={columns}
        striped
        center
        pagination
        selectableRows
        onSelectedRowsChange={(s) => setSelectedRows(s.selectedRows)}
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
