// src/Components/Pages/FeicomPages/Dashboard/index.jsx
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Input, Label, Spinner, Alert } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import axiosInstance from "../../../../api/axios";

// Cartes/graphs existants
import WidgetsWrapper from "./WidgetsWrapper";
import Example from "./component/graph_paiement";
import Widgets1 from "../../../Common/CommonWidgets/Widgets1";
import ProjectTable from "./component/project_table";
import SkillStatusChart from "../../../../Components/Widgets/Chart/SkillStatus";

// exercise redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExercices,
  selectExercices,
  selectExercicesLoading,
  selectExercicesError,
} from "../../../../reduxtool/exercicesSlice";


// (optionnel) Si tu veux lire user.agence depuis Redux
// import { useSelector } from "react-redux";
// const selectAuthUser = (state) => state.auth?.user || null;

// Mois
const MONTHS = [
  { value: "", label: "Tous les mois" },
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" }, { value: 4, label: "Avril" },
  { value: 5, label: "Mai" }, { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre" }, { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" }, { value: 12, label: "Décembre" },
];

// Status possibles (tu peux adapter si tu as une liste dynamique)
const STATUSES = [
  { value: "", label: "Tous les statuts" },
  { value: "In Provisional Acceptance", label: "In Provisional Acceptance" },
  { value: "In Final Acceptance", label: "In Final Acceptance" },
];

const Page1 = () => {
  // const authUser = useSelector(selectAuthUser);
  // const userHasAgency = !!(authUser?.agence?.id);
  // const forcedAgencyId = userHasAgency ? Number(authUser.agence.id) : null;

  //logique exercise
  const dispatch = useDispatch();
  const exercices = useSelector(selectExercices);
  const exercicesLoading = useSelector(selectExercicesLoading);
  const exercicesError = useSelector(selectExercicesError);

  // année par défaut = la plus récente des exercices remontés
  const defaultYear = useMemo(() => {
    const years = (exercices || [])
      .map(e => Number(e.annee))
      .filter(Boolean)
      .sort((a, b) => b - a);
    return years[0] || new Date().getFullYear();
  }, [exercices]);

  // remplace ton useState initial de year :
  const [year, setYear] = useState(defaultYear);

  // charge les exercices une fois si vide
  useEffect(() => {
    if (!exercices || exercices.length === 0) {
      dispatch(fetchExercices());
    }
  }, [dispatch, exercices]);

  // quand la liste d’exercices arrive, resynchronise l’année sélectionnée
  useEffect(() => {
    setYear(defaultYear);
  }, [defaultYear]);


  // ----- Filtres locaux -----
  const [month, setMonth] = useState("");            // "" = tous
  const [agence, setAgence] = useState("");          // "" = toutes
  const [status, setStatus] = useState("");          // "" = tous

  // ----- Agences (pour le select) -----
  const [agences, setAgences] = useState([]);
  const [agencesLoading, setAgencesLoading] = useState(false);
  const [agencesError, setAgencesError] = useState("");

  // ----- KPIs -----
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(false);
  const [kpisError, setKpisError] = useState("");

  // Charge la liste des agences (pour le select)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setAgencesLoading(true);
        setAgencesError("");
        const { data } = await axiosInstance.get("/feicom/api/agences/");
        if (mounted) setAgences(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) {
          setAgences([]);
          setAgencesError(e?.response?.data?.detail || "Impossible de charger les agences.");
        }
      } finally {
        if (mounted) setAgencesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Construit la query string en respectant les filtres optionnels
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (month) params.set("month", String(month));
    if (agence) params.set("agence", String(agence));
    if (status) params.set("status", status);
    return params.toString();
  }, [year, month, agence, status]);

  // Fetch KPIs
  const loadKpis = useCallback(async () => {
    const qs = buildQuery();
    const url = `/feicom/kpis/${qs ? "?" + qs : ""}`;

    setKpisLoading(true);
    setKpisError("");

    // DEBUG: logs pour dépannage
    console.log("[KPIs] Request URL:", url);
    console.log("[KPIs] Filters:", { year, month, agence, status });

    try {
      const { data } = await axiosInstance.get(url);
      // DEBUG: affiche réponse brute
      console.log("[KPIs] Response:", data);

      setKpis(data);
    } catch (e) {
      console.error("[KPIs] Error:", e?.response?.data || e?.message);
      setKpis(null);
      setKpisError(e?.response?.data?.detail || "Chargement impossible pour ces filtres.");
    } finally {
      setKpisLoading(false);
    }
  }, [buildQuery, year, month, agence, status]);

  // (Re)fetch à chaque changement de filtre
  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  // Widgets1 de droite (exemple supplémentaire)
  const w_final = useMemo(
    () => ({
      color: "success",
      icon: "check",
      title: "Réceptions définitives",
      total: kpis?.projects?.in_final_acceptance ?? "—",
      gros: null,
    }),
    [kpis]
  );

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" parent="Feicom" title="Dashboard" />
      <Container fluid={true}>
        {/* ---- BARRE DE FILTRES ---- */}
        {/* ---- BARRE DE FILTRES ---- */}
        <Card className="shadow-sm">
          <CardBody className="p-3">
            <Row className="g-3 align-items-end">

              {/* Exercice Column */}
              <Col xs={12} md={6} lg={3}>
                <div className="d-flex flex-column">
                  <Label className="form-label mb-1">Exercice</Label>
                  <Input
                    type="select"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    disabled={exercicesLoading}
                  >
                    {(exercices || [])
                      .map((e) => Number(e.annee))
                      .filter(Boolean)
                      .sort((a, b) => b - a)
                      .map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                  </Input>
                  {exercicesError && (
                    <div className="small text-danger mt-1">{exercicesError}</div>
                  )}
                </div>
              </Col>

              {/* Mois Column */}
              <Col xs={12} md={6} lg={3}>
                <div className="d-flex flex-column">
                  <Label className="form-label mb-1">Mois</Label>
                  <Input
                    type="select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))}
                  >
                    {MONTHS.map((m) => (
                      <option key={String(m.value)} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </Input>
                </div>
              </Col>

              {/* Agence Column */}
              <Col xs={12} md={6} lg={3}>
                <div className="d-flex flex-column">
                  <Label className="form-label mb-1">Agence</Label>
                  <Input
                    type="select"
                    value={agence}
                    onChange={(e) => setAgence(e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={agencesLoading}
                  >
                    <option value="">Toutes les agences</option>
                    {agences.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nom} ({a.code})
                      </option>
                    ))}
                  </Input>
                  {agencesError && <div className="small text-danger mt-1">{agencesError}</div>}
                </div>
              </Col>

              {/* Statut Column */}
              <Col xs={12} md={6} lg={3}>
                <div className="d-flex flex-column">
                  <Label className="form-label mb-1">Statut</Label>
                  <Input
                    type="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </Input>
                </div>
              </Col>

            </Row>
          </CardBody>
        </Card>

        {/* Erreur / Loader global */}
        {kpisError && (
          <Row className="mb-2">
            <Col xs={12}>
              <Alert color="warning" className="py-2 mb-0">{kpisError}</Alert>
            </Col>
          </Row>
        )}
        {kpisLoading && (
          <Row className="mb-2">
            <Col xs={12}><Spinner size="sm" /> <span className="ms-2">Chargement KPIs…</span></Col>
          </Row>
        )}

        {/* ---- WIDGETS (passe kpis en props) ---- */}
        <Row className="widget-grid">
          <WidgetsWrapper kpis={kpis} />
        </Row>

        {/* ---- CHARTS + WIDGET À DROITE ---- */}
        <Row>
          <Col md={12} lg={6}>
            {/* Tu peux lui passer des données mensuelles si l’API en fournit */}
            <Example data={kpis?.totals} />
          </Col>
          <Col md={12} lg={6} className="chart-widget">
            <Row>
              <SkillStatusChart kpis={kpis} />
            </Row>
            <Row>
              <Widgets1 data={w_final} />
            </Row>
          </Col>
        </Row>

        {/* ---- TABLE PROJETS ---- */}
        <Row>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <ProjectTable data={kpis?.projects?.items || []} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Page1;
