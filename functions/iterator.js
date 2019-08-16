export async function handler(event) {
  const dataToSend = event.emailData.pop();
  
  return {
    data: dataToSend,
    shouldContinue: dataToSend !== undefined
  };
}
