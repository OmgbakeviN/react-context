import React, { Fragment, useContext, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane,
  Spinner, Alert, Input,
} from 'reactstrap';
import { Target, Info, CheckCircle /*, PlusCircle */ } from 'react-feather';
import { /* Link, */ } from 'react-router-dom';
import { Done, All, Doing /*, CreateNewProject */ } from '../../../../Constant';
import { Breadcrumbs } from '../../../../AbstractElements';
import ProjectContext from '../../../../_helper/Project';
// import CusClass from '../Common/CusClass';
import CusClass from './CusClass';
import axiosInstance from '../../../../api/axios';
import FilterBar from './FilterBar';

const Project = () => {
  const { allData }   = useContext(ProjectContext);

  const navigate = useNavigate();

  // Onglets
  const [activeTab, setActiveTab] = useState('1');

  // User
  const [user, setUser] = useState(null);

  // Filtres (FilterBar)
  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [agenceOptions, setAgenceOptions]     = useState([]);
  const [communeOptions, setCommuneOptions]   = useState([]);
  const [filters, setFilters] = useState({ exercice: '', mois: '', agence: '', communes: [] });
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Réseau / données
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Couches de données
  const [baseData, setBaseData]       = useState([]); // résultat serveur (filtré ou non)
  const [displayData, setDisplayData] = useState([]); // baseData filtré par communes + search

  // Recherche
  const [search, setSearch] = useState('');

  // Infinite scroll
  const [visibleItems, setVisibleItems] = useState(20);
  const loaderRef = useRef(null);

  // --- init user ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        if (parsed?.role === 'REGIONAL' && parsed?.agence) {
          setFilters(f => ({ ...f, agence: parsed.agence }));
        }
      }
    } catch {}
  }, []);

  // --- charger communes ---
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

  // --- charger exercices ---
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

  // --- charger agences si NATIONAL ---
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

  // --- sync baseData with allData initially ---
  useEffect(() => {
    setBaseData(allData || []);
  }, [allData]);

  // --- AUTO FETCH serveur si exercice+mois+agence sont remplis; sinon fallback allData ---
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

  // --- Filtre communes + recherche (local) ---
  useEffect(() => {
    const { communes } = filters;

    // 1) filtrer par communes
    let afterCommunes = baseData;
    if (Array.isArray(communes) && communes.length > 0) {
      const setIds = new Set(communes.map(Number));
      afterCommunes = baseData.filter(p => setIds.has(Number(p.commune)));
    }

    // 2) recherche texte
    const q = search.trim().toLowerCase();
    const afterSearch = !q
      ? afterCommunes
      : afterCommunes.filter(row =>
          Object.values(row || {}).join(' ').toLowerCase().includes(q)
        );

    setDisplayData(afterSearch);
  }, [baseData, filters.communes, search]);

  // --- Réinitialiser le scroll si filtres/recherche changent ---
  useEffect(() => {
    setVisibleItems(20);
  }, [filters.exercice, filters.mois, filters.agence, filters.communes, search]);

  // --- listAll / doing / done (placeholder pour l’instant) ---
  const listAll   = useMemo(() => displayData, [displayData]);
  const listDoing = useMemo(() => displayData.filter(() => false), [displayData]); // à adapter si tu as un statut
  const listDone  = useMemo(() => displayData.filter(() => false), [displayData]); // à adapter si tu as un statut

  // --- elements visibles (infinite scroll) : se base sur listAll (DÉFINI ICI) ---
  const displayedData = useMemo(() => {
    return listAll.slice(0, visibleItems);
  }, [listAll, visibleItems]);

  // --- Observer pour infinite scroll (utilise displayedData.length) ---
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && visibleItems < listAll.length) {
      setVisibleItems(prev => prev + 20);
    }
  }, [listAll.length, visibleItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [handleObserver]);

  // handlers
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
  };

  return (
    <Fragment>
      <Breadcrumbs parent="Project" title="Project List" mainTitle="Project List" />
      <Container fluid={true}>
        <Row className="project-card">
          

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
                <div style={{  }} className="me-2">
                    {/* <Label className="form-label mb-0 small">Recherche</Label> */}
                    <Input
                      type="text"
                      placeholder="Rechercher…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
              </CardBody>
            </Card>
          </Col>

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
                  
                  {/* 
                  <Link
                    className="btn btn-primary"
                    style={{ color: 'white' }}
                    to={`${process.env.PUBLIC_URL}/app/project/new-project/${layoutURL}`}
                  >
                    <PlusCircle /> {CreateNewProject}
                  </Link> 
                  */}
                </Col>
              </Row>
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
                  {/* ALL */}
                  <TabPane tabId="1">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {displayedData.map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }}  onClick={ () => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)}  />
                        </Col>
                      ))}
                    </Row>

                    <div ref={loaderRef} className="d-flex justify-content-center">
                      {visibleItems < listAll.length ? (
                        <Spinner color="primary" />
                      ) : (
                        listAll.length > 0 && (
                          <Alert color="info" className="mb-0 mt-3">
                            Vous avez atteint la fin de la liste ({listAll.length} projets)
                          </Alert>
                        )
                      )}
                    </div>

                    {listAll.length === 0 && !loading && (
                      <Alert color="info" className="mb-0">Aucun projet.</Alert>
                    )}
                  </TabPane>

                  {/* DOING (placeholder) */}
                  <TabPane tabId="2">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {listDoing.slice(0, visibleItems).map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }}  onClick={ () => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)}  />
                        </Col>
                      ))}
                    </Row>
                    <div ref={loaderRef} className="d-flex justify-content-center">
                      {visibleItems < listDoing.length ? (
                        <Spinner color="primary" />
                      ) : (
                        listDoing.length > 0 && (
                          <Alert color="info" className="mb-0 mt-3">
                            Vous avez atteint la fin de la liste ({listDoing.length} projets)
                          </Alert>
                        )
                      )}
                    </div>
                    {listDoing.length === 0 && !loading && (
                      <Alert color="info" className="mb-0">Aucun projet en cours.</Alert>
                    )}
                  </TabPane>

                  {/* DONE (placeholder) */}
                  <TabPane tabId="3">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {listDone.slice(0, visibleItems).map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }}  onClick={ () => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)}  />
                        </Col>
                      ))}
                    </Row>
                    <div ref={loaderRef} className="d-flex justify-content-center ">
                      {visibleItems < listDone.length ? (
                        <Spinner color="primary" />
                      ) : (
                        listDone.length > 0 && (
                          <Alert color="info" className="mb-0 mt-3">
                            Vous avez atteint la fin de la liste ({listDone.length} projets)
                          </Alert>
                        )
                      )}
                    </div>
                    {listDone.length === 0 && !loading && (
                      <Alert color="info" className="mb-0">Aucun projet terminé.</Alert>
                    )}
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
