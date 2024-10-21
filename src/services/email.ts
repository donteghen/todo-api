import formData from 'form-data';
import Mailgun, {MessagesSendResult} from 'mailgun.js';
import { IEmailNotification } from "../models/interfaces";

const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({
    username: 'api', 
    key: process.env.MAILGUN_API_KEY!,  // Mailgun API key from env variable
});


/**
 * Function to send email notifications via Mailgun.
 * @param emailData - The data required to send the email.
 */
async function notify(emailData: IEmailNotification): Promise<MessagesSendResult> {
    const messageData = {
      from: emailData.source, // Sender's email address
      to: emailData.targets.join(', '), // List of recipients
      subject: emailData.data.title, // Email subject
      text: `${emailData.data.subtitle}\n\n${emailData.data.content}`, // Plain text email content
      html: `<h1>${emailData.data.title}</h1>
             <h2>${emailData.data.subtitle}</h2>
             <p>${emailData.data.content}</p>`, // HTML email content
    };
  
    try {
      const response = await mgClient.messages.create(process.env.MAILGUN_DOMAIN!, messageData);
      console.log('Email sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      return {status: 0}
    }
  }
  
export default notify ;


