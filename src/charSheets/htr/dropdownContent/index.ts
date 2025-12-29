import { DropdownOptions } from "../../root/domain";
import {
  archetypeOptionsRu,
  archetypeOptionsEn,
  edgeOptionsRu,
  edgeOptionsEn,
  startingVirtueOptionsRu,
  startingVirtueOptionsEn,
  backgroundOptionsRu,
  backgroundOptionsEn,
} from "./resources/optionsSources";

export function getDropdownOptions(language: string): DropdownOptions {
  const isRu = language === "ru";

  return {
    archetypeOptions: isRu ? archetypeOptionsRu : archetypeOptionsEn,
    edgeOptions: isRu ? edgeOptionsRu : edgeOptionsEn,
    startingVirtueOptions: isRu ? startingVirtueOptionsRu : startingVirtueOptionsEn,
    backgroundOptions: isRu ? backgroundOptionsRu : backgroundOptionsEn,
  };
}

export function useDropdownOptions() {
  // Эта функция будет использоваться в компонентах
  // Пока возвращаем русские опции по умолчанию
  return {
    archetypeOptions: archetypeOptionsRu,
    edgeOptions: edgeOptionsRu,
    startingVirtueOptions: startingVirtueOptionsRu,
    backgroundOptions: backgroundOptionsRu,
  };
}
