import { CommonAbilities } from "../../generic/domain";

// Demon: The Fallen использует расширенный набор способностей
export interface DemonAbilities extends CommonAbilities {
  // Таланты (дополнительные)
  dodge: number; // Увёрт
  intuition: number; // Интуиция

  // Навыки (дополнительные)
  demolitions: number; // Взрывное дело
  security: number; // Безопасность

  // Знания (дополнительные)
  linguistics: number; // Лингвистика
  religion: number; // Религия
  research: number; // Исследование
}
