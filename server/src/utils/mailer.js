import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendExchangeApprovalEmails = async (exchangeRequest, originalItem, requestingUser) => {
  // Normalize user objects and provide safe fallbacks
  const claimer = requestingUser || exchangeRequest.userId || {};
  const owner = (originalItem && (originalItem.user_id || originalItem.userId)) || {};
  console.log(requestingUser);
  const siteName = process.env.SITE_NAME || 'Lost and Found';

  const claimerEmailOptions = claimer.email
    ? {
        from: process.env.EMAIL_USER,
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
        from: process.env.EMAIL_USER,
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
    await Promise.all(sendPromises);
    console.log('Exchange approval emails sent successfully');
  } catch (error) {
    console.error('Error sending exchange approval emails:', error);
    // Do not throw to avoid breaking the approving flow; caller already handles logging
  }
};