import React, { useMemo, useState } from 'react';
import { Row, Col, Button, Label, Input, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

const months = [
  { value: '', label: 'Tous les mois' },
  { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },    { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },     { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },{ value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },{ value: 12, label: 'Décembre' },
];

const FilterBar = ({
  exerciceOptions = [],            // [{value, label}]
  agenceOptions = [],              // [{value, label}] (utilisé si showAgence=true)
  communeOptions = [],             // [{value, label}]  <-- NOUVEAU
  showAgence = false,              // NATIONAL => true / REGIONAL => false
  values,                          // { exercice:'', mois:'', agence:'', communes: [] }
  onChange,                        // (name, value) => void
  onApply,                         // () => void  (appelle l'API puis filtre communes côté parent)
  onReset,                         // () => void
  loading = false,
}) => {
  // dropdown communes (menu coulant)
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const visibleCommunes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return communeOptions;
    return communeOptions.filter(c => c.label.toLowerCase().includes(q));
  }, [communeOptions, search]);

  const toggle = () => setOpen(o => !o);

  const handleCheck = (id, checked) => {
    const current = Array.isArray(values.communes) ? values.communes : [];
    if (checked) {
      onChange('communes', [...current, id]);
    } else {
      onChange('communes', current.filter(x => x !== id));
    }
  };

  const selectAllVisible = () => {
    const current = new Set(values.communes || []);
    visibleCommunes.forEach(c => current.add(c.value));
    onChange('communes', Array.from(current));
  };

  const clearAllCommunes = () => onChange('communes', []);

  const communesLabel = useMemo(() => {
    const count = values?.communes?.length || 0;
    if (!count) return 'Toutes les communes';
    return `${count} commune${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''}`;
  }, [values]);

  return (
    <div className="mb-3">
      <Row className="g-3 align-items-end">
        {/* Exercice */}
        <Col xs={12} md={3} lg={2}>
          <Label className="form-label">Exercice</Label>
          <Input
            type="select"
            value={values.exercice}
            onChange={(e) => onChange('exercice', e.target.value)}
          >
            <option value="">Tous</option>
            {exerciceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Input>
        </Col>

        {/* Agence (visible seulement pour NATIONAL) */}
        {showAgence && (
          <Col xs={12} md={3} lg={2}>
            <Label className="form-label">Agence</Label>
            <Input
              type="select"
              value={values.agence}
              onChange={(e) => onChange('agence', e.target.value)}
            >
              <option value="">Toutes</option>
              {agenceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Input>
          </Col>
        )}

        {/* Mois */}
        <Col xs={12} md={3} lg={2}>
          <Label className="form-label">Mois (date début)</Label>
          <Input
            type="select"
            value={values.mois}
            onChange={(e) => onChange('mois', e.target.value)}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Input>
        </Col>

        {/* Communes : menu coulant avec checkboxes */}
        <Col xs={12} md={4} lg={3}>
          <Label className="form-label d-block">Communes</Label>
          <Dropdown isOpen={open} toggle={toggle}>
            <DropdownToggle caret color="outline-secondary" className="w-100 text-start">
              {communesLabel}
            </DropdownToggle>
            <DropdownMenu style={{ minWidth: 320, maxHeight: 320, overflowY: 'auto' }} className="p-2">
              <Input
                type="text"
                placeholder="Rechercher une commune…"
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="d-flex justify-content-between mb-2">
                <Button size="sm" color="light" onClick={selectAllVisible}>Tout sélectionner</Button>
                <Button size="sm" color="light" onClick={clearAllCommunes}>Tout désélectionner</Button>
              </div>
              {visibleCommunes.length === 0 ? (
                <div className="text-muted small px-1">Aucune commune</div>
              ) : (
                visibleCommunes.map(c => {
                  const checked = (values.communes || []).includes(c.value);
                  return (
                    <div className="form-check" key={c.value}>
                      <Input
                        id={`commune-${c.value}`}
                        type="checkbox"
                        className="form-check-input"
                        checked={checked}
                        onChange={(e) => handleCheck(c.value, e.target.checked)}
                      />
                      <Label className="form-check-label" htmlFor={`commune-${c.value}`}>
                        {c.label}
                      </Label>
                    </div>
                  );
                })
              )}
            </DropdownMenu>
          </Dropdown>
        </Col>

        {/* Actions */}
        <Col xs={12} md={3} lg={3} className="d-flex gap-2">
          {/* <Button
            color="primary"
            className="flex-grow-1"
            onClick={onApply}
            disabled={
              loading ||
              !values.exercice ||
              !values.mois ||
              // si showAgence, il faut aussi agence ; sinon on prend agence du localStorage côté parent
              (showAgence && !values.agence)
            }
          >
            {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : 'Filtrer'}
          </Button> */}
          <Button
            color="light"
            className="flex-grow-1"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterBar;
