import React, { ChangeEvent, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";

import { Options, Profile } from "../../../../root/domain";
import { usePreset } from "../../../../root/services/storageAdapter";
import { SelectButton } from "../../../uiPrimitives/SelectButton";

interface ProfileSectionItemProps<DataContext> {
  itemName: keyof Profile;
  value: string;
  dataContext: DataContext;
  setValue(value: string, dataContext: DataContext): void;
  options?: Options;
}

export const ProfileSectionItem = memo(function ProfileSectionItem<DataContext>(
  props: ProfileSectionItemProps<DataContext>
) {
  const { itemName, options, value, dataContext, setValue } = props;
  const { t } = useTranslation();
  const tr = useCallback(
    (key: string, options?: Record<string, unknown>) =>
      (t as (key: string, options?: Record<string, unknown>) => string)(
        key,
        options,
      ),
    [t],
  );
  const { preset } = usePreset();

  const labelKey = `charsheet.profile.${itemName}`;
  const v5LabelKey = `charsheet.v5.profile.${itemName}`;
  const label =
    preset === "vampire_v5"
      ? (() => {
          const translated = tr(v5LabelKey);
          return translated === v5LabelKey ? tr(labelKey) : translated;
        })()
      : tr(labelKey);

  const onProfileChange = useCallback(
    function onProfileChange(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.currentTarget;
      setValue(value, dataContext);
    },
    [setValue, dataContext]
  );

  const onSelectChange = useCallback(
    function onSelectChange(value: string) {
      setValue(value, dataContext);
    },
    [setValue, dataContext]
  );

  return (
    <div className="ProfileSectionItem tw-flex tw-mb-2 print:tw-mb-0">
      <label
        className="tw-mb-0 tw-text-sm tw-flex-0"
        htmlFor={`profileItem_${itemName}`}
        style={{
          // 'flexGrow': 0.45,
          // // 'flexGrow': 0,
          // 'flexShrink': 0,
          flexBasis: "7rem",
        }}
      >
        {label}
      </label>
      <input
        size={1}
        id={`profileItem_${itemName}`}
        style={{ boxShadow: "0 1px 0 #333333" }}
        className="tw-flex-1 tw-mx-2
          tw-bg-transparent tw-border-none hover:tw-outline
          hover:tw-outline-1 hover:tw-outline-red-600"
        value={value}
        onChange={onProfileChange}
      />
      {options && (
        <SelectButton
          className="print:tw-hidden"
          options={options}
          onChange={onSelectChange}
          selectOptionMsg={tr("charsheet.profile.select-label", {
            title: label,
          })}
        />
      )}
    </div>
  );
});
