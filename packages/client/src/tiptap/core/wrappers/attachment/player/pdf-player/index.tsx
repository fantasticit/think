import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface IProps {
  url: string;
}

export const PDFPlayer: React.FC<IProps> = ({ url }) => {
  const [total, setTotal] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setTotal(numPages);
  }

  return (
    <div className={styles.playerWrap}>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div className={styles.paginationWrap}>
        <Pagination total={total} pageSize={1} onChange={(page) => setPageNumber(page)} size="small"></Pagination>
      </div>
    </div>
  );
};
