import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';
import HeaderCard from '../../../Common/Component/HeaderCard';
import DataTableComponent from './DataTableComponent';
import axiosInstance from '../../../../api/axios';
import FilterBar from './FilterBar';

const DataTables = () => {
  // Options for selects
  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [agenceOptions, setAgenceOptions] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Draft (what user is editing in the FilterBar) + Applied (what table uses)
  const empty = { exercice: '', agence: '', mois: '' };
  const [draft, setDraft] = useState(empty);
  const [applied, setApplied] = useState(empty);

  // Load options once
  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        setLoadingFilters(true);
        const [exRes, agRes] = await Promise.all([
          axiosInstance.get('/feicom/api/exercices/'),
          axiosInstance.get('/feicom/api/agences/'),
        ]);
        if (!cancelled) {
          setExerciceOptions(exRes.data.map(x => ({ value: x.id, label: `${x.annee}` })));
          setAgenceOptions(agRes.data.map(a => ({ value: a.id, label: `${a.id} - ${a.nom}` })));
        }
      } catch (e) {
        console.error('Erreur chargement options filtres', e);
      } finally {
        if (!cancelled) setLoadingFilters(false);
      }
    };

    loadOptions();
    return () => { cancelled = true; };
  }, []);

  // FilterBar handlers
  const handleChange = (name, value) => {
    setDraft(prev => ({ ...prev, [name]: value }));
  };

  const onApply = () => {
    setApplied(draft);          // table will refetch using applied
  };

  const onReset = () => {
    setDraft(empty);            // clears selects in UI
    setApplied(empty);          // table refetches unfiltered
  };

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Data Tables" mainTitle="Data Tables" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title="Select Multiple and Delete Single Data" />
              <CardBody>
                <FilterBar
                  exerciceOptions={exerciceOptions}
                  agenceOptions={agenceOptions}
                  values={draft}              // ✅ controlled by draft
                  onChange={handleChange}
                  onApply={onApply}
                  onReset={onReset}
                  loading={loadingFilters}
                />
                <DataTableComponent filters={applied} />  {/* ✅ table listens to applied */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default DataTables;
