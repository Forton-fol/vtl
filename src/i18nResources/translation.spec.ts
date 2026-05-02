import { ruTranslation } from "./ruTranslation";
import { enTranslation } from "./enTranslation";

// проверяет, что в обоих переводах НЕ совпадают значения
describe("Translations check", () => {
  it("should have different values for ru and en", () => {
    const differences: ValueDiff[] = [];
    translationComparator(enTranslation, ruTranslation, [], differences);
    if (differences.length > 0) {
      console.log("Found identical translation values:", differences);
    }
    expect(differences).toEqual([]);
  });
});

type ValueDiff = {
  key: string;
  ru: string;
  en: string;
};

const allowedIdenticalValues = new Set([
  "register.patreonSection",
]);

function translationComparator(
  enObj: any,
  ruObj: any,
  path: string[] = [],
  differences: ValueDiff[] = [],
): void {
  if (typeof enObj === "string") {
    const key = path.join(".");
    if (enObj === ruObj && !allowedIdenticalValues.has(key)) {
      differences.push({
        key,
        ru: ruObj,
        en: enObj,
      });
    }
  } else {
    const keys = Object.keys(enObj);
    for (const key of keys) {
      translationComparator(
        enObj[key],
        ruObj[key],
        [...path, key],
        differences,
      );
    }
  }
}
