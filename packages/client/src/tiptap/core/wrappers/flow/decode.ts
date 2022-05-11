import pako from 'pako';

function parseXml(xml) {
  if (window.DOMParser) {
    const parser = new DOMParser();

    return parser.parseFromString(xml, 'text/xml');
  } else {
    const result = createXmlDocument();

    result.async = 'false';
    result.loadXML(xml);

    return result;
  }
}

function createXmlDocument() {
  let doc = null;

  if (document.implementation && document.implementation.createDocument) {
    doc = document.implementation.createDocument('', '', null);
  }

  return doc;
}

function getTextContent(node) {
  return node != null ? node[node.textContent === undefined ? 'text' : 'textContent'] : '';
}

export function decode(data) {
  try {
    const node = parseXml(data).documentElement;
    if (node != null && node.nodeName == 'mxfile') {
      const diagrams = node.getElementsByTagName('diagram');
      if (diagrams.length > 0) {
        data = getTextContent(diagrams[0]);
      }
    }
  } catch (e) {
    // ignore
  }

  try {
    data = atob(data);
  } catch (e) {
    console.log(e);
    alert('atob failed: ' + e);
    return;
  }

  try {
    data = pako.inflateRaw(
      Uint8Array.from(data, (c) => String(c).charCodeAt(0)),
      {
        to: 'string',
      }
    );
  } catch (e) {
    console.log(e);
    alert('inflateRaw failed: ' + e);
    return;
  }

  try {
    data = decodeURIComponent(data);
  } catch (e) {
    console.log(e);
    alert('decodeURIComponent failed: ' + e);
    return;
  }

  return data;
}
