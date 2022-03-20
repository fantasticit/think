import { Table as BuiltInTable } from '@tiptap/extension-table';
import { TableView } from '../views/tableView';

export const Table = BuiltInTable.extend({
  // @ts-ignore
  addOptions() {
    return {
      ...this.parent?.(),
      View: TableView,
    };
  },
}).configure({
  resizable: true,
});
