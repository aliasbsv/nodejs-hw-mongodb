function parseContactType(value) {
  // Проверка, что введенное значение — строка
  if (typeof value !== 'string') {
    return null;
  }

  // Список разрешенных значений
  const allowedTypes = ['work', 'home', 'personal'];

  // Если введенное значение входит в разрешенные значения, возвращаем его
  if (allowedTypes.includes(value)) {
    return value;
  }
  // Если значение невалидно, возвращаем null
  return null;
}

export function parseFilterParams(query) {
  const { type } = query;
  const parsedContactType = parseContactType(type);
  return {
    contactType: parsedContactType,
  };
}
