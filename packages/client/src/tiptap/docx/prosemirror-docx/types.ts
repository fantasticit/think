import { INumberingOptions } from 'docx';
import { IPropertiesOptions } from 'docx/build/file/core-properties';

export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export type IFootnotes = Mutable<Required<IPropertiesOptions>['footnotes']>;
export type INumbering = INumberingOptions['config'][0];
