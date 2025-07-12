export const couponSelectFinder = (property, value) => {
  if (value && property) {
    return property.filter(prop => value === prop.label)[0];
  }
  return null;
};