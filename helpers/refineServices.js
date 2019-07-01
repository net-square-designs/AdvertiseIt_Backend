// This function takes care of formatting returned services package options to make it readable
const refineServices = returnedServices => returnedServices.rows.map((eachService) => {
  const parsedOptions = JSON.parse(eachService.dataValues.packageoptions);
  return Object.assign(eachService.dataValues, {
    packageoptions: parsedOptions
  });
});

export default refineServices;
