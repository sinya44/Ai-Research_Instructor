// Builds a simple Word (.docx) file in the browser - no library needed.
const crcT = (() => {
  const t = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
const crc32 = (b) => {
  let c = 0xffffffff
  for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function zipStore(files) {
  const enc = new TextEncoder()
  const parts = []
  const cen = []
  let off = 0
  files.forEach(([name, txt]) => {
    const n = enc.encode(name)
    const d = enc.encode(txt)
    const crc = crc32(d)
    const lh = new DataView(new ArrayBuffer(30))
    lh.setUint32(0, 0x04034b50, true)
    lh.setUint16(4, 20, true)
    lh.setUint16(6, 0x0800, true)
    lh.setUint16(12, 0x21, true)
    lh.setUint32(14, crc, true)
    lh.setUint32(18, d.length, true)
    lh.setUint32(22, d.length, true)
    lh.setUint16(26, n.length, true)
    const ch = new DataView(new ArrayBuffer(46))
    ch.setUint32(0, 0x02014b50, true)
    ch.setUint16(4, 20, true)
    ch.setUint16(6, 20, true)
    ch.setUint16(8, 0x0800, true)
    ch.setUint16(14, 0x21, true)
    ch.setUint32(16, crc, true)
    ch.setUint32(20, d.length, true)
    ch.setUint32(24, d.length, true)
    ch.setUint16(28, n.length, true)
    ch.setUint32(42, off, true)
    parts.push(lh.buffer, n, d)
    cen.push(ch.buffer, n)
    off += 30 + n.length + d.length
  })
  const cdSize = cen.reduce((t, p) => t + (p.byteLength || p.length), 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, files.length, true)
  end.setUint16(10, files.length, true)
  end.setUint32(12, cdSize, true)
  end.setUint32(16, off, true)
  return [...parts, ...cen, end.buffer]
}

const xmlEsc = (t) =>
  String(t)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function buildDocx(sections) {
  const p = (txt, sz, bold, before, after) =>
    '<w:p><w:pPr><w:spacing w:before="' + before + '" w:after="' + after + '"/></w:pPr><w:r><w:rPr>' +
    (bold ? '<w:b/>' : '') + '<w:sz w:val="' + sz + '"/></w:rPr><w:t xml:space="preserve">' + xmlEsc(txt) + '</w:t></w:r></w:p>'
  const body = sections
    .map(([h, t]) => p(h, 32, true, 360, 120) + t.split(/\r?\n/).map((l) => p(l, 24, false, 0, 120)).join(''))
    .join('')
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
  const X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  const zip = zipStore([
    ['[Content_Types].xml', X + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['_rels/.rels', X + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', X + '<w:document ' + W + '><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>'],
  ])
  return new Blob(zip, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}
