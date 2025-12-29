import { DropdownOptions } from "../../root/domain";
import {
  archetypeOptionsRu,
  archetypeOptionsEn,
  creedOptionsRu,
  creedOptionsEn,
  startingVirtueOptionsRu,
  startingVirtueOptionsEn,
  edgeCreedOptionsRu,
  edgeCreedOptionsEn,
  backgroundOptionsRu,
  backgroundOptionsEn,
} from "./resources/optionsSources";

export function getDropdownOptions(language: string): DropdownOptions {
  const isRu = language === "ru";

  return {
    archetypeOptions: isRu ? archetypeOptionsRu : archetypeOptionsEn,
    creedOptions: isRu ? creedOptionsRu : creedOptionsEn,
    startingVirtueOptions: isRu ? startingVirtueOptionsRu : startingVirtueOptionsEn,
    edgeCreedOptions: isRu ? edgeCreedOptionsRu : edgeCreedOptionsEn,
    backgroundOptions: isRu ? backgroundOptionsRu : backgroundOptionsEn,
  };
}

export function useDropdownOptions() {
  // Эта функция будет использоваться в компонентах
  // Пока возвращаем русские опции по умолчанию
  return {
    archetypeOptions: archetypeOptionsRu,
    creedOptions: creedOptionsRu,
    startingVirtueOptions: startingVirtueOptionsRu,
    edgeCreedOptions: edgeCreedOptionsRu,
    backgroundOptions: backgroundOptionsRu,
  };
}
