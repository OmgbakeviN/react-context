import React from 'react';
import { Row, Col, Button, Label, Input } from 'reactstrap';

const months = [
  { value: '', label: 'Tous les mois' },
  { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' }, { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' }, { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' },
];

const FilterBar = ({
  exerciceOptions = [], // [{value, label}]
  agenceOptions = [],   // [{value, label}]
  values,               // { exercice:'', agence:'', mois:'' }
  onChange,             // (name, value) => void
  onApply,              // () => void
  onReset,              // () => void
  loading = false
}) => {
  return (
    <div className="mb-3">
  <Row className="g-3 align-items-end">
    {/* Colonne Exercice */}
    <Col xs={12} md={3} lg={2}>
      <div className="form-group">
        <Label className="form-label">Exercice</Label>
        <Input
          type="select"
          value={values.exercice}
          onChange={(e) => onChange('exercice', e.target.value)}
          className="form-select"
        >
          <option value="">Tous</option>
          {exerciceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Input>
      </div>
    </Col>

    {/* Colonne Agence */}
    <Col xs={12} md={3} lg={2}>
      <div className="form-group">
        <Label className="form-label">Agence</Label>
        <Input
          type="select"
          value={values.agence}
          onChange={(e) => onChange('agence', e.target.value)}
          className="form-select"
        >
          <option value="">Toutes</option>
          {agenceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Input>
      </div>
    </Col>

    {/* Colonne Mois */}
    <Col xs={12} md={3} lg={2}>
      <div className="form-group">
        <Label className="form-label">Mois (date début)</Label>
        <Input
          type="select"
          value={values.mois}
          onChange={(e) => onChange('mois', e.target.value)}
          className="form-select"
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </Input>
      </div>
    </Col>

    {/* Boutons d'action */}
    <Col xs={12} md={3} lg={2} className="d-flex gap-2">
      <Button 
        color="primary" 
        className="flex-grow-1" 
        onClick={onApply} 
        disabled={loading || !values.exercice || !values.agence || !values.mois }
      >
        {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : 'Filtrer'}
      </Button>
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
