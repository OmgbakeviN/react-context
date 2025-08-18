import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row, Input, Label } from 'reactstrap';
import {
  WidgetsData1 as WD1,
  WidgetsData2 as WD2,
  WidgetsData3 as WD3,
  WidgetsData4 as WD4,
  WidgetsData5 as WD5,
  WidgetsData6 as WD6,
} from '../../../Data/DefaultDashboard';
import Widgets1 from '../../Common/CommonWidgets/Widgets1';
import axiosInstance from '../../../api/axios';

const WidgetsWrapper = () => {
  // ---------------------------
  // 1) Local state
  // ---------------------------
  const [loadingAgences, setLoadingAgences] = useState(true);
  const [w1, setW1] = useState(WD1);         // Nombre d'agences (global)

  const [exerciceOptions, setExerciceOptions] = useState([]);
  const [selectedExercice, setSelectedExercice] = useState(''); // '' = none chosen

  // widgets that depend on exercice
  const [loadingExWidgets, setLoadingExWidgets] = useState(false);
  const [w2, setW2] = useState({ ...WD2, total: null }); // Projets
  const [w3, setW3] = useState({ ...WD3, total: null }); // Paiements
  const [w4, setW4] = useState({ ...WD4, total: null }); // Réceptions prov.
  const [w5, setW5] = useState({ ...WD5, total: null }); // Réceptions déf.
  const [w6, setW6] = useState({ ...WD6, total: null }); // Mise en service

  // ---------------------------
  // 2) Load global count: agences (no filter)
  // ---------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingAgences(true);
        // ✅ check the correct endpoint path; most of your app uses /feicom/api/...
        const res = await axiosInstance.get('/feicom/agences/count/');
        if (cancelled) return;
        const d = res.data;
        const total =
          (typeof d === 'number' && d) ||
          d?.total_agences ||
          d?.total ||
          d?.count ||
          (Array.isArray(d) ? d.length : 0);
        setW1(prev => ({ ...prev, total }));
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to load agences count:', e);
          setW1(prev => ({ ...prev, total: 0 })); // fallback
        }
      } finally {
        if (!cancelled) setLoadingAgences(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---------------------------
  // 3) Load exercice options for the filter
  // ---------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get('/feicom/api/exercices/');
        if (cancelled) return;
        setExerciceOptions(res.data.map(x => ({ value: x.id, label: String(x.annee) })));
      } catch (e) {
        if (!cancelled) console.error('Failed to load exercices:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---------------------------
  // 4) When an Exercice is chosen, load all exercice-scoped widgets in parallel
  //    API examples (adjust to your backend):
  //    /feicom/api/exercice/{ex}/number-projects/
  //    /feicom/api/exercice/{ex}/number-payments/
  //    /feicom/api/exercice/{ex}/number-receptions-provisoires/
  //    /feicom/api/exercice/{ex}/number-receptions-definitives/
  //    /feicom/api/exercice/{ex}/number-mise-en-service/
  // ---------------------------
  useEffect(() => {
    let cancelled = false;

    // If no exercice selected, clear numbers to null and stop
    if (!selectedExercice) {
      setW2(prev => ({ ...prev, total: null }));
      setW3(prev => ({ ...prev, total: null }));
      setW4(prev => ({ ...prev, total: null }));
      setW5(prev => ({ ...prev, total: null }));
      setW6(prev => ({ ...prev, total: null }));
      return;
    }

    (async () => {
      try {
        setLoadingExWidgets(true);

        const ex = Number(selectedExercice);

        // Build all requests
        const reqs = [
          axiosInstance.get(`/feicom/api/exercice/${ex}/number-projects/`),
          axiosInstance.get(`/feicom/api/exercice/${ex}/number-payments/`),
          axiosInstance.get(`/feicom/api/exercice/${ex}/number-receptions-provisoires/`),
          axiosInstance.get(`/feicom/api/exercice/${ex}/number-receptions-definitives/`),
          axiosInstance.get(`/feicom/api/exercice/${ex}/number-mise-en-service/`),
        ];

        const results = await Promise.allSettled(reqs);
        if (cancelled) return;

        // Helper to read a number defensively
        const pickNumber = (data, preferredKey) => {
          if (preferredKey && typeof data?.[preferredKey] === 'number') return data[preferredKey];
          return (
            (typeof data === 'number' && data) ||
            data?.total ||
            data?.count ||
            (Array.isArray(data) ? data.length : 0)
          );
        };

        // Map results to widgets (adjust preferredKey per your backend response)
        // projects
        if (results[0].status === 'fulfilled') {
          const n = pickNumber(results[0].value.data, 'nombre_projets');
          setW2(prev => ({ ...prev, total: n }));
        } else setW2(prev => ({ ...prev, total: 0 }));

        // payments
        if (results[1].status === 'fulfilled') {
          const n = pickNumber(results[1].value.data, 'total_decompte');
          setW3(prev => ({ ...prev, total: n }));
        } else setW3(prev => ({ ...prev, total: 0 }));

        // receptions provisoires
        if (results[2].status === 'fulfilled') {
          const n = pickNumber(results[2].value.data, 'total_receptions_provisoires');
          setW4(prev => ({ ...prev, total: n }));
        } else setW4(prev => ({ ...prev, total: 0 }));

        // receptions definitives
        if (results[3].status === 'fulfilled') {
          const n = pickNumber(results[3].value.data, 'total_receptions_definitives');
          setW5(prev => ({ ...prev, total: n }));
        } else setW5(prev => ({ ...prev, total: 0 }));

        // mise en service
        if (results[4].status === 'fulfilled') {
          const n = pickNumber(results[4].value.data, 'total_mise_en_service');
          setW6(prev => ({ ...prev, total: n }));
        } else setW6(prev => ({ ...prev, total: 0 }));
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to load exercice-scoped widgets:', e);
          setW2(prev => ({ ...prev, total: 0 }));
          setW3(prev => ({ ...prev, total: 0 }));
          setW4(prev => ({ ...prev, total: 0 }));
          setW5(prev => ({ ...prev, total: 0 }));
          setW6(prev => ({ ...prev, total: 0 }));
        }
      } finally {
        if (!cancelled) setLoadingExWidgets(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedExercice]);

  // One combined loading flag for nicer UI (optional)
  const anyLoading = useMemo(() => loadingAgences || loadingExWidgets, [loadingAgences, loadingExWidgets]);

  // ---------------------------
  // 5) Render
  // ---------------------------
  return (
    <>
      {/* Simple Exercice filter on top of the widgets */}
      <Col xs="12" className="mb-3">
        <Label className="form-label">Exercice</Label>
        <Input
          type="select"
          value={selectedExercice}
          onChange={(e) => setSelectedExercice(e.target.value)}
          className="w-auto"
        >
          <option value="">— Sélectionnez un exercice —</option>
          {exerciceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Input>
      </Col>

      <Col xxl="auto" xl="3" sm="6" className="box-col-6">
        <Row>
          <Col xl="12">
            <Widgets1 data={w1} loading={loadingAgences} />
          </Col>
          <Col xl="12">
            <Widgets1 data={w2} loading={loadingExWidgets && !!selectedExercice} />
          </Col>
        </Row>
      </Col>

      <Col xxl="auto" xl="3" sm="6" className="box-col-6">
        <Row>
          <Col xl="12">
            <Widgets1 data={w3} loading={loadingExWidgets && !!selectedExercice} />
          </Col>
          <Col xl="12">
            <Widgets1 data={w4} loading={loadingExWidgets && !!selectedExercice} />
          </Col>
        </Row>
      </Col>

      <Col xxl="auto" xl="12" sm="6" className="box-col-6">
        <Row>
          <Col xxl="12" xl="6" className="box-col-12">
            <Widgets1 data={w5} loading={loadingExWidgets && !!selectedExercice} />
          </Col>
          <Col xxl="12" xl="6" className="box-col-12">
            <Widgets1 chartClass="profit-chart" data={w6} loading={loadingExWidgets && !!selectedExercice} />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default WidgetsWrapper;
