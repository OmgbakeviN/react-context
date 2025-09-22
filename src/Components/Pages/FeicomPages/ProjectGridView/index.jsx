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

  const [activeTab, setActiveTab] = useState('1');

  const [user, setUser] = useState(null);

  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [agenceOptions, setAgenceOptions]     = useState([]);
  const [communeOptions, setCommuneOptions]   = useState([]);
  const [filters, setFilters] = useState({ exercice: '', mois: '', agence: '', communes: [] });
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const [baseData, setBaseData]       = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const [search, setSearch] = useState('');

  /* ---------- Infinite scroll (réécrit uniquement) ---------- */
  const PAGE_SIZE = 20;
  const [visibleItems, setVisibleItems] = useState(PAGE_SIZE);

  const sentinelAllRef = useRef(null);
  const sentinelDoingRef = useRef(null);
  const sentinelDoneRef = useRef(null);
  const observerRef = useRef(null);

  const resetVisible = useCallback(() => setVisibleItems(PAGE_SIZE), []);
  /* ---------------------------------------------------------- */

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

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/feicom/api/communes/');
        const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setCommuneOptions(list.map(c => ({ value: c.id, label: c.nom })));
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingFilters(true);
      try {
        const res = await axiosInstance.get('/feicom/api/exercices/');
        const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
          .map(e => ({ value: e.id, label: String(e.annee) }));
        setExerciceOptions(opts);
      } catch (e) {
      } finally {
        setLoadingFilters(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user?.role === 'NATIONAL') {
      (async () => {
        try {
          const res = await axiosInstance.get('/feicom/api/agences/');
          const opts = (Array.isArray(res.data) ? res.data : (res.data?.results ?? []))
            .map(a => ({ value: a.id, label: a.nom }));
          setAgenceOptions(opts);
        } catch (e) {
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    setBaseData(allData || []);
  }, [allData]);

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

  useEffect(() => {
    const { communes } = filters;
    let afterCommunes = baseData;
    if (Array.isArray(communes) && communes.length > 0) {
      const setIds = new Set(communes.map(Number));
      afterCommunes = baseData.filter((p) => {
        // Certains endpoints renvoient l'objet, d'autres parfois un id : on gère les 2.
        const communeId =
          p && p.commune
            ? (typeof p.commune === "object" ? p.commune.id : p.commune)
            : null;
    
        return communeId != null && setIds.has(Number(communeId));
      });
    }
    const q = search.trim().toLowerCase();
    const afterSearch = !q
      ? afterCommunes
      : afterCommunes.filter(row =>
          Object.values(row || {}).join(' ').toLowerCase().includes(q)
        );
    setDisplayData(afterSearch);
  }, [baseData, filters.communes, search]);

  /* ---------- Infinite scroll reset (réécrit) ---------- */
  useEffect(() => {
    resetVisible();
  }, [filters.exercice, filters.mois, filters.agence, filters.communes, search, resetVisible]);

  useEffect(() => {
    resetVisible();
  }, [activeTab, resetVisible]);
  /* ---------------------------------------------------- */

  const listAll   = useMemo(() => displayData, [displayData]);
  const listDoing = useMemo(() => displayData.filter(() => false), [displayData]);
  const listDone  = useMemo(() => displayData.filter(() => false), [displayData]);

  /* ---------- Infinite scroll: calcul des listes affichées (réécrit) ---------- */
  const displayedAll   = useMemo(() => listAll.slice(0, visibleItems),   [listAll, visibleItems]);
  const displayedDoing = useMemo(() => listDoing.slice(0, visibleItems), [listDoing, visibleItems]);
  const displayedDone  = useMemo(() => listDone.slice(0, visibleItems),  [listDone, visibleItems]);

  const canLoadMoreAll   = displayedAll.length   < listAll.length;
  const canLoadMoreDoing = displayedDoing.length < listDoing.length;
  const canLoadMoreDone  = displayedDone.length  < listDone.length;
  /* --------------------------------------------------------------------------- */

  /* ---------- IntersectionObserver unique + 3 sentinelles (réécrit) ---------- */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const io = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (!entry || !entry.isIntersecting) return;

        const moreAll   = activeTab === '1' && canLoadMoreAll;
        const moreDoing = activeTab === '2' && canLoadMoreDoing;
        const moreDone  = activeTab === '3' && canLoadMoreDone;

        if (moreAll || moreDoing || moreDone) {
          setVisibleItems(prev => prev + PAGE_SIZE);
        }
      },
      { root: null, rootMargin: '600px', threshold: 0 }
    );

    observerRef.current = io;

    const target =
      activeTab === '1' ? sentinelAllRef.current :
      activeTab === '2' ? sentinelDoingRef.current :
      sentinelDoneRef.current;

    if (target) io.observe(target);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [activeTab, canLoadMoreAll, canLoadMoreDoing, canLoadMoreDone]);
  /* --------------------------------------------------------------------------- */

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
                  onApply={() => {}}
                  onReset={handleReset}
                  loading={loadingFilters || loading}
                />
                <div className="me-2">
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
                <Col md="6" className="d-flex justify-content-end gap-2"></Col>
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
                  <TabPane tabId="1">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {displayedAll.map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }} onClick={() => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)} />
                        </Col>
                      ))}
                    </Row>

                    <div ref={sentinelAllRef} className="d-flex justify-content-center">
                      {canLoadMoreAll ? (
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

                  <TabPane tabId="2">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {displayedDoing.map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }} onClick={() => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)} />
                        </Col>
                      ))}
                    </Row>
                    <div ref={sentinelDoingRef} className="d-flex justify-content-center">
                      {canLoadMoreDoing ? (
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

                  <TabPane tabId="3">
                    <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                      {displayedDone.map((item, i) => (
                        <Col key={item.id ?? i}>
                          <CusClass item={item} style={{ cursor: 'pointer' }} onClick={() => navigate(`${process.env.PUBLIC_URL}/feicom/projets/${item.id}/detail`)} />
                        </Col>
                      ))}
                    </Row>
                    <div ref={sentinelDoneRef} className="d-flex justify-content-center ">
                      {canLoadMoreDone ? (
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
