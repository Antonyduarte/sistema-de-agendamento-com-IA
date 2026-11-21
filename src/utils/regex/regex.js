const NOME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Formato: AAAA-MM-DD. Valida mês e quantidade de dias de cada mês.
// Fevereiro aceita até 29; o ano bissexto deve ser validado separadamente, se necessário.
const DATA_REGEX = /^(?:\d{4})-(?:(?:01|03|05|07|08|10|12)-(?:0[1-9]|[12]\d|3[01])|(?:04|06|09|11)-(?:0[1-9]|[12]\d|30)|02-(?:0[1-9]|1\d|2[0-9]))$/
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

export { NOME_REGEX, EMAIL_REGEX, DATA_REGEX, HORA_REGEX }
