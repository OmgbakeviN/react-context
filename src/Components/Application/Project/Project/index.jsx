import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane,
  Spinner, Alert, Input, Label
} from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Link } from 'react-router-dom';
import { Done, All, Doing, CreateNewProject } from '../../../../Constant';
import { Breadcrumbs } from '../../../../AbstractElements';
import ProjectContext from '../../../../_helper/Project';
import CusClass from '../Common/CusClass';
import CustomizerContext from '../../../../_helper/Customizer';
import axiosInstance from '../../../../api/axios';
import FilterBar from './FilterBar';

const Project = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const { allData }   = useContext(ProjectContext);

  const [activeTab, setActiveTab] = useState('1');

  // user infos
  const [user, setUser] = useState(null);

  // filter bar state
  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [agenceOptions, setAgenceOptions]     = useState([]);
  const [communeOptions, setCommuneOptions]   = useState([]);
  const [filters, setFilters] = useState({ exercice: '', mois: '', agence: '', communes: [] });
  const [loadingFilters, setLoadingFilters] = useState(false);

  // network state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // data layers
  const [baseData, setBaseData]       = useState([]); // server (all or server-filtered)
  const [displayData, setDisplayData] = useState([]); // baseData filtered by communes + search

  const [search, setSearch] = useState('');

  // init user
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        // si regional → set agence direct
        if (parsed?.role === 'REGIONAL' && parsed?.agence) {
          setFilters(f => ({ ...f, agence: parsed.agence }));
        }
      }
    } catch {}
  }, []);

  // charger communes 
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/feicom/api/communes/');
        const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setCommuneOptions(list.map(c => ({ value: c.id, label: c.nom })));
      } catch (e) {
        console.error('Erreur chargement communes', e);
      }
    })();
  }, []);

  // charger exercices
  useEffect(() => {
    (async () => {
      setLoadingFilters(true);
      try {
        const res = await axiosInstance.get('/feicom/api/exercices/');
        const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
          .map(e => ({ value: e.id, label: String(e.annee) }));
        setExerciceOptions(opts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFilters(false);
      }
    })();
  }, []);

  // charger agences si NATIONAL
  useEffect(() => {
    if (user?.role === 'NATIONAL') {
      (async () => {
        try {
          const res = await axiosInstance.get('/feicom/api/agences/');
          const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
            .map(a => ({ value: a.id, label: a.nom }));
          setAgenceOptions(opts);
        } catch (e) {
          console.error('Erreur chargement agences', e);
        }
      })();
    }
  }, [user]);

  // sync baseData with allData initially
  useEffect(() => {
    setBaseData(allData || []);
  }, [allData]);

  // ------- AUTO FETCH: exercice+mois+agence complete -> call server filter, else use allData -------
  useEffect(() => {
    const { exercice, mois, agence } = filters;
    const agenceId = user?.role === 'NATIONAL' ? agence : user?.agence;
    const canServerFilter = Boolean(exercice) && Boolean(mois) && Boolean(agenceId);

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (canServerFilter) {
          const url = `/feicom/api/filters/projects/${Number(exercice)}/${Number(agenceId)}/${Number(mois)}/`;
          const res = await axiosInstance.get(url);
          const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
          if (!cancelled) setBaseData(list);
        } else {
          // no server filter -> fallback to full list from context
          if (!cancelled) setBaseData(allData || []);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Erreur lors du chargement : " + (e?.message || ''));
          setBaseData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [filters.exercice, filters.mois, filters.agence, user, allData]);

  // ------- CLIENT FILTERS: communes + search applied locally to baseData -------
  useEffect(() => {
    const { communes } = filters;

    // 1) filter by communes (optional)
    let afterCommunes = baseData;
    if (Array.isArray(communes) && communes.length > 0) {
      const setIds = new Set(communes.map(Number));
      afterCommunes = baseData.filter(p => setIds.has(Number(p.commune)));
    }

    // 2) apply search text
    const q = search.trim().toLowerCase();
    const afterSearch = !q
      ? afterCommunes
      : afterCommunes.filter(row =>
          Object.values(row || {}).join(' ').toLowerCase().includes(q)
        );

    setDisplayData(afterSearch);
  }, [baseData, filters.communes, search]);

  // search memo (optional, displayData is already filtered)
  const searchedData = useMemo(() => displayData, [displayData]);

  const handleChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const handleReset = () => {
    setFilters({
      exercice: '',
      mois: '',
      agence: user?.role === 'REGIONAL' ? user?.agence : '',
      communes: [],
    });
    setSearch('');
    setError(null);
    // baseData will auto-become allData via effect above
  };

  const listAll   = searchedData;
  const listDoing = searchedData.filter(() => false); 
  const listDone  = searchedData.filter(() => false); 

  return (
    <Fragment>
      <Breadcrumbs parent="Project" title="Project List" mainTitle="Project List" />
      <Container fluid={true}>
        <Row className="project-card">
          <Col md="12" className="project-list">
            <Card>
              <Row className="align-items-center">
                <Col md="6">
                  <Nav tabs className="border-tab">
                    <NavItem>
                      <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                        <Target /> {All}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                        <Info /> {Doing}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
                        <CheckCircle /> {Done}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col md="6" className="d-flex justify-content-end gap-2">
                  <div style={{ maxWidth: 280 }} className="me-2">
                    <Label className="form-label mb-0 small">Recherche</Label>
                    <Input
                      type="text"
                      placeholder="Rechercher…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  {/* <Link
                    className="btn btn-primary"
                    style={{ color: 'white' }}
                    to={`${process.env.PUBLIC_URL}/app/project/new-project/${layoutURL}`}
                  >
                    <PlusCircle /> {CreateNewProject}
                  </Link> */}
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Filter bar */}
          <Col sm="12" className="mt-2">
            <Card>
              <CardBody>
                <FilterBar
                  exerciceOptions={exerciceOptions}
                  agenceOptions={user?.role === 'NATIONAL' ? agenceOptions : []}
                  communeOptions={communeOptions}
                  showAgence={user?.role === 'NATIONAL'}
                  values={filters}
                  onChange={handleChange}
                  onApply={() => { /* auto-apply: no-op */ }}
                  onReset={handleReset}
                  loading={loadingFilters || loading}
                />
              </CardBody>
            </Card>
          </Col>

          {loading && (
            <Col sm="12" className="mt-2">
              <Card><CardBody className="d-flex justify-content-center"><Spinner /></CardBody></Card>
            </Col>
          )}
          {error && (
            <Col sm="12" className="mt-2">
              <Card><CardBody><Alert color="danger" className="mb-0">{error}</Alert></CardBody></Card>
            </Col>
          )}

          <Col sm="12">
            <Card>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      {listAll.length === 0 ? (
                        <Col xs="12"><Alert color="info" className="mb-0">Aucun projet.</Alert></Col>
                      ) : (
                        listAll.map((item, i) => <CusClass item={item} key={item.id ?? i} />)
                      )}
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      {listDoing.length === 0 ? (
                        <Col xs="12"><Alert color="info" className="mb-0">Aucun projet en cours.</Alert></Col>
                      ) : (
                        listDoing.map((item, i) => <CusClass item={item} key={item.id ?? i} />)
                      )}
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      {listDone.length === 0 ? (
                        <Col xs="12"><Alert color="info" className="mb-0">Aucun projet terminé.</Alert></Col>
                      ) : (
                        listDone.map((item, i) => <CusClass item={item} key={item.id ?? i} />)
                      )}
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Project;
