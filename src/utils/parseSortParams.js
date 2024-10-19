import { SORT_ORDER } from '../constants/index.js';

function parseSortOrder(value) {
  if (typeof value !== 'string') {
    return SORT_ORDER.ASC;
  }
  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value) !== true) {
    return SORT_ORDER.ASC;
  }
  return value;
}

function parseSortBy(value) {
  //Якщо клієнт не передав параметр сортування то ми сортуємо по id
  if (typeof value !== 'string') {
    return '_id';
  }
  //Визначаємо список полів по яким можливе сортування
  const keys = ['name'];
  // Якщо параметр сортування не входить в список доступних то сортуємо теж по id
  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
