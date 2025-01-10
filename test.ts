const genrateId = () => {
  const data = Date.now();
  const prefix = 'SHRP_' + data;
  return prefix;
};

genrateId();
