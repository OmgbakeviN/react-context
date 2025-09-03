import React from 'react';
import { Row, Col, Label, Input, Button } from 'reactstrap';

const CommuneFilter = ({ communes = [], selected = [], onChange, onApply, onReset, loading }) => {
  const handleCheck = (id, checked) => {
    if (checked) {
      onChange([...selected, id]);
    } else {
      onChange(selected.filter(cid => cid !== id));
    }
  };

  return (
    <div className="mb-3">
      <Label className="form-label fw-bold">Filtrer par commune</Label>
      <Row>
        {communes.map(c => (
          <Col xs={12} md={4} lg={3} key={c.id} className="mb-1">
            <Input
              type="checkbox"
              id={`commune-${c.id}`}
              checked={selected.includes(c.id)}
              onChange={e => handleCheck(c.id, e.target.checked)}
            />{' '}
            <Label for={`commune-${c.id}`} className="mb-0">{c.nom}</Label>
          </Col>
        ))}
      </Row>
      <div className="mt-2 d-flex gap-2">
        <Button
          color="primary"
          onClick={onApply}
          disabled={loading || selected.length === 0}
        >
          Appliquer
        </Button>
        <Button
          color="light"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CommuneFilter;
