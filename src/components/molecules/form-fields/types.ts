import type { ReactNode } from "react";

/** Label + value list — EHR `TOptionType` subset (string values for Radix Select). */
export type FormOption = { label: string; value: string };

export type FormFieldBaseProps = {
  name: string;
  label: ReactNode;
  /** Shown under the control — EHR `help` */
  description?: ReactNode;
  disabled?: boolean;
  isRequired?: boolean;
};
