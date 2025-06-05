function parseIsFav(value) {
  if (typeof value === 'undefined') return undefined;

  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined;
}

//фу-я для парсингу фільтр.
export function parseFilterParams(query) {
  
	const { type, isFavourite } = query;
  const result = {};

  if (typeof type !== 'undefined') {
    result.contactType = type;
  }

  const parsedIsFavourite = parseIsFav(isFavourite);
  if (typeof parsedIsFavourite === 'boolean') {
    result.isFavourite = parsedIsFavourite;
  }

  return result;
};
