import { useEffect } from "react";
import useSWR from "swr";
import { setStorage, getStorage } from "helpers/storage";

export enum Width {
  "standardWidth" = "standardWidth",
  "fullWidth" = "fullWidth",
}

const WIDTH_KEY = "document-style-width";
const FONT_SIZE_KEY = "document-style-font-size";
const DEFAULT_WIDTH = Width.standardWidth;
const DEFAULT_FONT_SIZE = 16;

export const useDocumentStyle = () => {
  const { data, mutate } = useSWR(
    `/fe/mock/${WIDTH_KEY}/${FONT_SIZE_KEY}`,
    () => {
      if (typeof window !== "undefined") {
        return {
          width: getStorage(WIDTH_KEY) || DEFAULT_WIDTH,
          fontSize:
            parseInt(getStorage(FONT_SIZE_KEY), 10) || DEFAULT_FONT_SIZE,
        };
      }

      return {
        width: DEFAULT_WIDTH,
        fontSize: DEFAULT_FONT_SIZE,
      };
    }
  );

  const setWidth = (width: Width) => {
    setStorage(WIDTH_KEY, width);
    mutate();
  };

  const setFontSize = (fontSize: number) => {
    setStorage(FONT_SIZE_KEY, fontSize);
    mutate();
  };

  useEffect(() => {
    mutate();
  }, []);

  return {
    width: (data && data.width) || DEFAULT_WIDTH,
    fontSize: (data && data.fontSize) || DEFAULT_FONT_SIZE,
    setWidth,
    setFontSize,
  };
};
