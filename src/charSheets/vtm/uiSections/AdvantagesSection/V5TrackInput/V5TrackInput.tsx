import React, { memo } from "react";
import classnames from "classnames";

import "./V5TrackInput.css";

interface V5TrackInputProps {
  name: string;
  boxes: number[];
  onChange(index: number, value: number): void;
  className?: string;
}

export const V5TrackInput = memo(function V5TrackInput(
  props: V5TrackInputProps
) {
  const { name, boxes, onChange, className } = props;

  return (
    <div className={classnames("V5TrackInput", className)}>
      {boxes.map((value, index) => (
        <button
          key={`${name}.${index}`}
          type="button"
          className={classnames("V5TrackInput__box", {
            "is-superficial": value === 1,
            "is-aggravated": value === 2,
          })}
          aria-label={`${name}-${index + 1}`}
          onClick={() => onChange(index, (value + 1) % 3)}
        />
      ))}
    </div>
  );
});