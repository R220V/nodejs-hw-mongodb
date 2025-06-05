//фу-я для сортування
function parseSortBy(value) {
    if (typeof value === 'undefined') {
        return 'contact_id';
    }
    const keys = ['contact_id', 'name', 'createdAt'];
    if (keys.includes(value) !== true) {
        return 'contact_id';
    }
    return value;
}

//фу-я для сортування по зростанню
function parseSortOrder(value) {
    if (typeof value === 'undefined') {
        return 'asc';
    }

    if (value !== 'asc' && value !== 'desc') {
        return 'asc';
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
