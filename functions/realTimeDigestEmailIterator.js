export async function handler(event) {
  const dataToSend = event.emailData.pop();

  return {
    emailData: event.emailData,
    data: dataToSend,
    shouldContinue: dataToSend !== undefined
  };
}
