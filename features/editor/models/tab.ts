import { FileModel } from './file';

export interface TabModel {
  file: FileModel;
  isDirty: boolean;
  isPreview: boolean;
}
