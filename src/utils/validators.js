export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let chk1 = 0, chk2 = 0;
  for (let i = 0; i < 9; i++) {
    chk1 += parseInt(cpf.charAt(i)) * (10 - i);
    chk2 += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let dig1 = 11 - (chk1 % 11);
  if (dig1 > 9) dig1 = 0;
  chk2 += dig1 * 2;
  let dig2 = 11 - (chk2 % 11);
  if (dig2 > 9) dig2 = 0;
  return cpf.charAt(9) == dig1 && cpf.charAt(10) == dig2;
};

export const calculateAge = (dob) => {
  const diff_ms = Date.now() - new Date(dob).getTime();
  const age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};