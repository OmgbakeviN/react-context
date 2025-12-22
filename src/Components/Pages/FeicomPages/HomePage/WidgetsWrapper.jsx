// src/Components/Pages/FeicomPages/Dashboard/WidgetsWrapper.jsx
import React, { useMemo } from "react";
import { Row, Col } from "reactstrap";
import Widgets1 from "../../../Common/CommonWidgets/Widgets1";

const WidgetsWrapper = ({ kpis }) => {
  // Sécurise l'accès aux totaux
  const totals = kpis?.totals || {};
  const w_proj = useMemo(() => ({
    color: "info",
    icon: "layers",
    title: "Projets (filtrés)",
    total: kpis?.projects?.total ?? "—",
    gros: null,
  }), [kpis]);

  const w_decomptes = useMemo(() => ({
    color: "primary",
    icon: "dollar",
    title: "Décomptes (année / mois)",
    total: `${totals?.expenses_from_decomptes?.year_total ?? "—"} / ${totals?.expenses_from_decomptes?.month_total ?? "—"}`,
    gros: null,
  }), [totals]);

  const w_dpo = useMemo(() => ({
    color: "warning",
    icon: "file",
    title: "DPO Dépenses (an/mois)",
    total: `${totals?.dpo_expenses?.year_total ?? "—"} / ${totals?.dpo_expenses?.month_total ?? "—"}`,
    gros: null,
  }), [totals]);

  const w_actual = useMemo(() => ({
    color: "success",
    icon: "check",
    title: "Réalisations (an/mois)",
    total: `${totals?.actual_expenses?.year_total ?? "—"} / ${totals?.actual_expenses?.month_total ?? "—"}`,
    gros: null,
  }), [totals]);

  return (
    <Row className="g-3">
      <Col md={6} lg={4}><Widgets1 data={w_proj} noDelta /></Col>
      <Col md={6} lg={4}><Widgets1 data={w_decomptes} noDelta /></Col>
      <Col md={6} lg={4}><Widgets1 data={w_dpo} noDelta /></Col>
      <Col md={6} lg={4}><Widgets1 data={w_actual} noDelta /></Col>
    </Row>
  );
};

export default WidgetsWrapper;
