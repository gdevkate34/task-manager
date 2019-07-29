const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to: email,
        from:'gdevkate34@gmail.com',
        subject:'Thanks fro joining Task App!',
        text:`Welcome to app, ${name}. Let me know how you go along with it.`
        
    })
}

const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'gdevkate34@gmail.com',
        subject:'Good Bye!',
        text:`Good Bye, ${name}. Let us know is there anything to keep you onboard!.`
        
    })
}

module.exports ={
    sendWelcomeEmail,
    sendCancellationEmail
}