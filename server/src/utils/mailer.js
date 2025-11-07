import nodemailer from 'nodemailer';

// Transporter will be initialized asynchronously. We expose a promise so callers can await readiness.
let transporter = null;
let isTestAccount = false;
const transporterReady = (async () => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      try {
        await transporter.verify();
        console.log('SMTP Server is ready to send emails');
      } catch (err) {
        console.error('SMTP Configuration Error:', err);
      }
    } else {
      // No real credentials provided — create a test account (Ethereal) for development/testing
      console.warn('EMAIL_USER / EMAIL_PASS not set — falling back to Ethereal test SMTP account for email testing');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      isTestAccount = true;
      console.log('Ethereal test account created. Messages will be visible via preview URLs in the logs.');
    }
  } catch (err) {
    console.error('Failed to initialize mail transporter:', err);
  }
})();

export const sendExchangeApprovalEmails = async (exchangeRequest, originalItem, requestingUser) => {
  // Normalize user objects and provide safe fallbacks
  const claimer = requestingUser || exchangeRequest.userId || {};
  const owner = (originalItem && (originalItem.user_id || originalItem.userId)) || {};
  console.log(requestingUser);
  const siteName = process.env.SITE_NAME || 'Lost and Found';

  // Wait for transporter to be ready
  await transporterReady;

  if (!transporter) {
    console.error('No mail transporter available - skipping email notifications');
    return;
  }

  const claimerEmailOptions = claimer.email
    ? {
        from: process.env.EMAIL_USER ? `${process.env.SITE_NAME} <${process.env.EMAIL_USER}>` : `${process.env.SITE_NAME} <no-reply@localhost>`,
        to: claimer.email,
        subject: `Your ${exchangeRequest.type === 'lost' ? 'Lost' : 'Found'} Item Exchange Request Approved - ${siteName}`,
        html: `
          <h2>Your Exchange Request Has Been Approved</h2>
          <p>Hello ${claimer.full_name || claimer.name || 'User'},</p>
          <p>Your request for the following item has been approved by an admin:</p>
          <ul>
            <li><strong>Item:</strong> ${exchangeRequest.title || ''}</li>
            <li><strong>Category:</strong> ${exchangeRequest.category || ''}</li>
            <li><strong>Status:</strong> ${exchangeRequest.status || ''}</li>
          </ul>
          <p>The item owner's contact information is below so you can arrange the handover:</p>
          <p><strong>Name:</strong> ${owner.full_name || owner.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${owner.email || 'N/A'}</p>
          ${owner.phone ? `<p><strong>Phone:</strong> ${owner.phone}</p>` : ''}
          <p>Please reach out to them to finalize the exchange.</p>
          <p>Thank you,<br/>${siteName} Team</p>
        `
      }
    : null;

  const ownerEmailOptions = owner.email
    ? {
        from: process.env.EMAIL_USER ? `${process.env.SITE_NAME} <${process.env.EMAIL_USER}>` : `${process.env.SITE_NAME} <no-reply@localhost>`,
        to: owner.email,
        subject: `Your Item Has Been ${exchangeRequest.type === 'lost' ? 'Found' : 'Claimed'} - ${siteName}`,
        html: `
          <h2>Your Item Has Been ${exchangeRequest.type === 'lost' ? 'Found' : 'Claimed'}</h2>
          <p>Hello ${owner.full_name || owner.name || 'User'},</p>
          <p>The following item associated with your post has been ${exchangeRequest.type === 'lost' ? 'found' : 'claimed'}:</p>
          <ul>
            <li><strong>Item:</strong> ${exchangeRequest.title || ''}</li>
            <li><strong>Category:</strong> ${exchangeRequest.category || ''}</li>
            <li><strong>Status:</strong> ${exchangeRequest.status || ''}</li>
          </ul>
          <p>The ${exchangeRequest.type === 'lost' ? 'finder' : 'claimer'}'s contact information is:</p>
          <p><strong>Name:</strong> ${claimer.full_name || claimer.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${claimer.email || 'N/A'}</p>
          ${claimer.phone ? `<p><strong>Phone:</strong> ${claimer.phone}</p>` : ''}
          <p>Please contact them to arrange pickup/delivery.</p>
          <p>Thank you,<br/>${siteName} Team</p>
        `
      }
    : null;

  const sendPromises = [];
  if (claimerEmailOptions) sendPromises.push(transporter.sendMail(claimerEmailOptions));
  else console.warn('No email found for claimer, skipping claimer notification');

  if (ownerEmailOptions) sendPromises.push(transporter.sendMail(ownerEmailOptions));
  else console.warn('No email found for item owner, skipping owner notification');

  if (sendPromises.length === 0) {
    console.warn('No valid recipient emails for exchange approval notifications');
    return;
  }

  try {
    const results = await Promise.all(sendPromises);
    console.log('Exchange approval emails sent successfully');

    // If using Ethereal test account, log preview URLs so developers can view the messages
    if (isTestAccount) {
      results.forEach((info) => {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) console.log('Preview URL:', url);
      });
    }
  } catch (error) {
    console.error('Error sending exchange approval emails:', error);
    // Do not throw to avoid breaking the approving flow; caller already handles logging
  }
};