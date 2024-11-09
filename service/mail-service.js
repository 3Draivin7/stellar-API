const nodemailer = require ('nodemailer');
class MailService {

constructor(){
    this.transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        },
    })
}

async sendActivationMail(email, name, secondName,link){
await this.transporter.sendMail({
    from:process.env.SMTP_USER,
    to:process.env.ADMIN_USER,
    subject: 'Активация аккаунта на ' + process.env.API_URL,
    text:'',
    html:`
    <div>
<h1>
    Попытка регистрации от менеджера с табельным номером: ${email},
    Именем: ${name},
    Фамилией: ${secondName}
</h1>
<a href="${link}">${link}</a>
    </div>
    `
})
}
}

module.exports = new MailService();