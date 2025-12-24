import React, { useMemo, useState } from "react";
import {
  Dropdown, DropdownToggle, DropdownMenu,
  Input, Button
} from "reactstrap";

/**
 * SearchableDropdown
 * Petit dropdown avec champ de recherche en tête du menu.
 *
 * Props:
 *  - items: Array<{ value: string|number, label: string }>
 *  - value: string|number|null
 *  - onChange: (value) => void
 *  - placeholder?: string
 *  - disabled?: boolean
 *  - noSelectionLabel?: string        // label lorsque value est vide
 */
const SearchableDropdown = ({
  items = [],
  value = "",
  onChange,
  placeholder = "Rechercher…",
  disabled = false,
  noSelectionLabel = "— (inchangé)",
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const toggle = () => setOpen((o) => !o);

  const currentLabel = useMemo(() => {
    const found = items.find((it) => String(it.value) === String(value));
    return found ? found.label : noSelectionLabel;
  }, [items, value, noSelectionLabel]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return items.slice(0, 50); // limite d’affichage
    return items.filter((it) => it.label.toLowerCase().includes(text)).slice(0, 50);
  }, [items, q]);

  return (
    <Dropdown isOpen={open} toggle={toggle} disabled={disabled}>
      <DropdownToggle caret color="light" className="w-100 text-start">
        <span className={value ? "" : "text-muted"}>{currentLabel}</span>
      </DropdownToggle>
      <DropdownMenu className="p-2" style={{ width: "100%", maxHeight: 320, overflow: "auto" }}>
        {/* Champ recherche sticky */}
        <div style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
          <Input
            type="text"
            bsSize="sm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="mb-2"
          />
        </div>

        {/* Liste d’options */}
        {filtered.length ? (
          filtered.map((it) => (
            <Button
              key={it.value}
              color="white"
              className="w-100 text-start mb-1 border"
              onClick={() => {
                onChange(it.value);
                setOpen(false);
              }}
            >
              {it.label}
            </Button>
          ))
        ) : (
          <div className="text-muted small px-1 py-2">Aucun résultat</div>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SearchableDropdown;
