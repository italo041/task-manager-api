const sgMail = require('@sendgrid/mail');
  
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'italo_fernando11@hotmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'italo_fernando11@hotmail.com',
        subject: `${name} we are sad because you left`,
        text: `We feel bad that you left, we will still be with open arms when you return.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
 