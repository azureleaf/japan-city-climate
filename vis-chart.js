// Mapping from field name to index number;
// this improves the accessibility to the towns data
//    by creating the shorthand for indices
// e.g. "fields.total_pop" returns "1"
//    because it's the 2nd element in stats.columns
fields = {};
stats.columns.forEach((column, index) => {
  fields[column] = index;
});

months = stats.data;
