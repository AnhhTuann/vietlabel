export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log('\n================== [EMAIL SIMULATION] ==================');
  console.log('TO: ' + to);
  console.log('SUBJECT: ' + subject);
  console.log('BODY:\n' + html);
  console.log('========================================================\n');
  return true;
};
