import * as R from "ramda";

import { defaultBackgroundUrl } from "../../misc/services/initialValues";
import { CharSheet } from "../../root/domain";
import { CompositeReducer, initialCharSheet } from "../../root/services/public";

import { miscActions } from "./actions";

const { reduce } = new CompositeReducer<CharSheet>().assign(miscActions);

describe("miscActions", () => {
  it("setBackgroundColor", () => {
    expect(initialCharSheet.settings.backgroundColor).toBe("#efede8");
    const charSheet = reduce(initialCharSheet, {
      type: "setBackgroundColor",
      props: ["#ffabab"],
    });
    expect(charSheet.settings.backgroundColor).toBe("#ffabab");
  });

  it("setCharsheetBackColor", () => {
    expect(initialCharSheet.settings.charsheetBackColor).toBe("#fbfaf7");
    const charSheet = reduce(initialCharSheet, {
      type: "setCharsheetBackColor",
      props: ["#00ff00"],
    });
    expect(charSheet.settings.charsheetBackColor).toBe("#00ff00");
  });

  it("setCharsheetBackImage", () => {
    expect(initialCharSheet.settings.charsheetBackImage_v2).toBe(
      defaultBackgroundUrl
    );
    const charSheet = reduce(initialCharSheet, {
      type: "setCharsheetBackImage",
      props: ["url"],
    });
    expect(charSheet.settings.charsheetBackImage_v2).toBe("url");
  });

  it("setCharsheetBackMode", () => {
    expect(initialCharSheet.settings.charsheetBackMode).toBe("charsheet-color");
    const charSheet = reduce(initialCharSheet, {
      type: "setCharsheetBackMode",
      props: ["charsheet-none"],
    });
    expect(charSheet.settings.charsheetBackMode).toBe("charsheet-none");
  });
});
