import React, { memo, useCallback, useState } from "react";
import { getSpecializations } from "../../domain/specializations";
import { useSettings } from "../../../misc/services/storageAdapter";

interface SpecializationPickerProps {
  statKey: string;
  value: number;
  specialization: string | undefined;
  onSetSpecialization: (statKey: string, value: string) => void;
}

/**
 * Shows a small specialization selector under a stat when it has 4+ dots.
 * Uses official VtM V20 specialization lists.
 * Can be disabled via Settings > showSpecializations.
 */
export const SpecializationPicker = memo(function SpecializationPicker(
  props: SpecializationPickerProps,
) {
  const { statKey, value, specialization, onSetSpecialization } = props;
  const { settings } = useSettings();
  const [customMode, setCustomMode] = useState(false);

  const onSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "__custom__") {
        setCustomMode(true);
        onSetSpecialization(statKey, "");
      } else {
        setCustomMode(false);
        onSetSpecialization(statKey, val);
      }
    },
    [statKey, onSetSpecialization],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSetSpecialization(statKey, e.target.value);
    },
    [statKey, onSetSpecialization],
  );

  if (value < 4) return null;
  if (settings.showSpecializations === false) return null;

  const options = getSpecializations(statKey);
  const current = specialization ?? "";

  // Show as custom if value is not in the list or custom mode is active
  const isCustom = customMode || (current !== "" && !options.includes(current));

  return (
    <div className="tw-flex tw-items-center tw-gap-1 tw-ml-1 tw-mb-0.5 tw-w-full">
      <select
        className="tw-bg-transparent tw-text-xs tw-border-b tw-border-gray-400
          tw-outline-none tw-py-0 tw-px-0.5 tw-max-w-[10rem]
          hover:tw-border-red-600 focus:tw-border-red-600"
        style={{ fontSize: "0.7em", lineHeight: 1.2 }}
        value={isCustom ? "__custom__" : current}
        onChange={onSelectChange}
        title="Специализация"
      >
        <option value="">— спец. —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value="__custom__">Своя…</option>
      </select>
      {isCustom && (
        <input
          type="text"
          className="tw-bg-transparent tw-text-xs tw-border-b tw-border-gray-400
            tw-outline-none tw-py-0 tw-px-0.5 tw-w-24
            hover:tw-border-red-600 focus:tw-border-red-600"
          style={{ fontSize: "0.7em", lineHeight: 1.2 }}
          value={current}
          onChange={onInputChange}
          placeholder="Своя спец."
        />
      )}
    </div>
  );
});
