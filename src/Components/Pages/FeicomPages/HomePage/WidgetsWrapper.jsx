// src/Components/Pages/FeicomPages/Dashboard/WidgetsWrapper.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Label,
  Spinner,
  Alert,
  FormGroup,
} from "reactstrap";
import axiosInstance from "../../../../api/axios";
import Widgets1 from "../../../Common/CommonWidgets/Widgets1";
import MonthlyDecomptes from "../Graphs/MonthlyDecomptes";
import Monthly_final from "../Graphs/Monthly_final";
import Monthly_provisional from "../Graphs/Monthly_provisional";

// --- Redux exercices (années dispo)
import {
  fetchExercices,
  selectExercices,
  selectExercicesLoading,
  selectExercicesError,
} from "../../../../reduxtool/exercicesSlice";

// --- Redux auth (pour récupérer user.agence)
const selectAuthUser = (state) => state.auth?.user || null;

// --- Table des mois (id → libellé)
const MONTHS = [
  { value: "", label: "Tous les mois" },
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

const WidgetsWrapper = () => {
  const dispatch = useDispatch();

  // --------------------------
  // 1) Données Redux
  // --------------------------
  const exercices = useSelector(selectExercices);
  const exercicesLoading = useSelector(selectExercicesLoading);
  const exercicesError = useSelector(selectExercicesError);
  const authUser = useSelector(selectAuthUser); // { username, role, agence, ... }

  // --------------------------
  // 2) Sélecteurs locaux (année, mois, agence)
  // --------------------------

  // Année par défaut = la plus récente dispo (sinon année courante)
  const defaultYear = useMemo(() => {
    const years = (exercices || [])
      .map((e) => Number(e.annee))
      .filter(Boolean)
      .sort((a, b) => b - a);
    return years[0] || new Date().getFullYear();
  }, [exercices]);

  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(""); // "" => tous les mois

  // Agence : si user a une agence → on force cet id ; sinon on laisse choisir
  const userHasAgency = !!(authUser && authUser.agence && authUser.agence.id);
  const forcedAgencyId = userHasAgency ? Number(authUser.agence.id) : null;

  // Liste des agences (utile uniquement si user n'a pas d'agence)
  const [agences, setAgences] = useState([]);
  const [agencesLoading, setAgencesLoading] = useState(false);
  const [agencesError, setAgencesError] = useState("");

  // agenceId sélectionnée côté UI quand user n'a pas d'agence
  const [agenceId, setAgenceId] = useState("");

  // --------------------------
  // 3) Stats API
  // --------------------------
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState("");

  // Charger les exercices si vide
  useEffect(() => {
    if (!exercices || exercices.length === 0) {
      dispatch(fetchExercices());
    }
  }, [dispatch, exercices]);

  // Sync année par défaut après fetch
  useEffect(() => {
    setYear(defaultYear);
  }, [defaultYear]);

  // Charger les agences uniquement si user n'a pas d'agence
  useEffect(() => {
    let mounted = true;
    const loadAgences = async () => {
      if (userHasAgency) return; // inutile si agence forcée
      setAgencesLoading(true);
      setAgencesError("");
      try {
        const { data } = await axiosInstance.get("/feicom/api/agences/");
        if (mounted) setAgences(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) {
          setAgences([]);
          setAgencesError(
            e?.response?.data?.detail || "Impossible de charger les agences."
          );
        }
      } finally {
        if (mounted) setAgencesLoading(false);
      }
    };
    loadAgences();
    return () => {
      mounted = false;
    };
  }, [userHasAgency]);

  // Construit l'URL /feicom/api/projets/par-periode/{year}[/{month}][/agence/{id}]/
  const buildStatsUrl = useCallback(
    (y, m, agencyId) => {
      // année est obligatoire
      let url = `/feicom/api/projets/par-periode/${y}/`;

      // mois optionnel (si vide => on n'ajoute pas)
      if (m) url += `${m}/`;

      // agence optionnelle (si définie => on ajoute)
      if (agencyId) url += `agence/${agencyId}/`;

      return url;
    },
    []
  );

  // Charge les stats selon les filtres actifs
  const loadStats = useCallback(
    async (y, m, agencyId) => {
      if (!y) return;
      setLoadingStats(true);
      setStatsError("");

      // agence effective :
      // - si user a une agence → on force forcedAgencyId
      // - sinon on prend l'input agenceId s'il est non vide
      const effectiveAgencyId = userHasAgency ? forcedAgencyId : (agencyId || "");

      try {
        const url = buildStatsUrl(y, m, effectiveAgencyId);
        const { data } = await axiosInstance.get(url);
        // attendu (identique à la version précédente):
        // { filters:{year}, total_decomptes, provisional_count, final_count }
        setStats(data);
      } catch (e) {
        setStats(null);
        setStatsError(
          e?.response?.data?.detail ||
          "Impossible de charger les statistiques pour ces filtres."
        );
      } finally {
        setLoadingStats(false);
      }
    },
    [buildStatsUrl, forcedAgencyId, userHasAgency]
  );

  // Requêter quand un filtre change
  useEffect(() => {
    loadStats(year, month, agenceId);
  }, [year, month, agenceId, loadStats]);

  // --------------------------
  // 4) Widgets (sans reformater les valeurs)
  // --------------------------
  const w_total = useMemo(
    () => ({
      color: "primary",
      icon: "dollar",
      title: "Total Décomptes",
      total: stats?.total_decomptes ?? "—",
      gros: null,
    }),
    [stats]
  );

  const w_prov = useMemo(
    () => ({
      color: "warning",
      icon: "file",
      title: "Réceptions provisoires",
      total: stats?.provisional_count ?? "—",
      gros: null,
    }),
    [stats]
  );

  const w_final = useMemo(
    () => ({
      color: "success",
      icon: "check",
      title: "Réceptions définitives",
      total: stats?.final_count ?? "—",
      gros: null,
    }),
    [stats]
  );

  return (
    <>
      <Card className="shadow-sm">
        <CardBody>
          {/* -------- Barre de filtres (Année, Mois, Agence) -------- */}
          <Row className="g-3 align-items-end mb-2">
            {/* Sélecteur Année */}
            <Col xs={12} md={4} lg={3}>
              <div className="w-100">
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
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </Input>
                {exercicesError && (
                  <div className="small text-danger mt-1">{exercicesError}</div>
                )}
              </div>
              {loadingStats && <Spinner size="sm" />}
            </Col>

            {/* Sélecteur Mois */}
            <Col xs={12} md={4} lg={3}>
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
            </Col>

            {/* Sélecteur Agence (affiché uniquement si user n'a PAS d'agence) */}
            {!userHasAgency && (
              <Col xs={12} md={4} lg={3}>
                <Label className="form-label mb-1">Agence</Label>
                <Input
                  type="select"
                  value={agenceId}
                  onChange={(e) =>
                    setAgenceId(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  disabled={agencesLoading}
                >
                  <option value="">Toutes les agences</option>
                  {agences.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nom} ({a.code})
                    </option>
                  ))}
                </Input>
                {agencesError && (
                  <div className="small text-danger mt-1">{agencesError}</div>
                )}
              </Col>
            )}
          </Row>

          {/* Erreur des stats */}
          {statsError && (
            <Row className="mb-2">
              <Col xs={12}>
                <Alert color="warning" className="py-2 mb-0">
                  {statsError}
                </Alert>
              </Col>
            </Row>
          )}

          {/* -------- Widgets -------- */}
          <Row className="g-3">
            <Col md={6} lg={4}>
              <Widgets1 data={w_total} noDelta />
            </Col>
            <Col md={6} lg={4}>
              <Widgets1 data={w_prov} noDelta />
            </Col>
            <Col md={6} lg={4}>
              <Widgets1 data={w_final} noDelta />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* graphiques */}
      <Row className="g-3">
        <Col md={12} lg={6}>
          <Card>
            <CardBody>
              <h3>Decomptes</h3>
              <MonthlyDecomptes data={stats?.monthly_decomptes} />
            </CardBody>
          </Card>
        </Col>
        <Col md={12} lg={6}>
          <Card>
            <CardBody>
              <h3>Receptions Provisoires</h3>
              <Monthly_provisional data={stats?.monthly_provisional_counts} />
            </CardBody>
          </Card>
        </Col>
      </Row >
      <Row className="g-3">
        <Col md={12} lg={6}>
          <Card>
            <CardBody claddName="pr-4">
              <h3>Receptions Provisoires</h3>
              <Monthly_final data={stats?.monthly_final_counts} />
            </CardBody>
          </Card>
        </Col >
      </Row>
    </>
  );
};

export default WidgetsWrapper;
