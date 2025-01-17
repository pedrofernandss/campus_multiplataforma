import emailjs from 'emailjs-com';

emailjs.init(process.env.EXPO_PUBLIC_USER_ID_EMAILJS || '');

export const sendSugestionNewsEmail = async (template: string, sugestion: string) => {

  const serviceID = process.env.EXPO_PUBLIC_EMAIL_SERVICE_ID || ''; 
  const templateID = template; 

  var templateParams = {
    to_name: 'Campusito',
    message: sugestion,  
  }

  emailjs.send(serviceID, templateID, templateParams).then(
    (response) => {
      console.log('E-mail enviado com sucesso!', response.status, response.text);
  })
  .catch((error) => {
    console.error('Erro ao enviar e-mail:', error);
  });
};

export const sendBugInformEmail = async (template: string, sugestion: string) => {

  const serviceID = process.env.EXPO_PUBLIC_EMAIL_SERVICE_ID || ''; 
  const templateID = template; 

  var templateParams = {
    to_name: process.env.EXPO_PUBLIC_RESPONSIBLE_NAM,
    message: sugestion,  
  }

  emailjs.send(serviceID, templateID, templateParams).then(
    (response) => {
      console.log('E-mail enviado com sucesso!', response.status, response.text);
  })
  .catch((error) => {
    console.error('Erro ao enviar e-mail:', error);
  });
};
