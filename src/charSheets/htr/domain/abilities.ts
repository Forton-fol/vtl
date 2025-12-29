import { CommonAbilities } from "../../generic/domain";

// HTR использует расширенный набор способностей
export interface HTRAbilities extends CommonAbilities {
  // Таланты (дополнительные)
  dodge: number; // Уклонение
  intuition: number; // Интуиция
  cunning: number; // Хитрость

  // Навыки (дополнительные)
  security: number; // Безопасность
  fencing: number; // Фехтование
  demolitions: number; // Взрывчатка

  // Знания (дополнительные)
  bureaucracy: number; // Бюрократия
  linguistics: number; // Лингвистика
  research: number; // Поиск
}
