export const MIME_WORD_DOCS = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const MIME_EXCEL_DOCS = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];
export const MIME_PPT_DOCS = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];
export const MIME_OFFICE_DOCS = [
  ...MIME_WORD_DOCS,
  ...MIME_EXCEL_DOCS,
  ...MIME_PPT_DOCS
];

export const MIME_PDF = ['application/pdf'];

export const MIME_IMAGES = ['image/jpeg', 'image/png'];

export const MIME_TEXTS = ['text/plain'];
