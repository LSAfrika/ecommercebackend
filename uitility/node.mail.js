const nodemail=require('nodemailer')

let mailtransport=nodemail.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL ,
        pass:process.env.MAILPASSWORD
    }
})

let mail={
    from:process.env.EMAIL,
    to:'chege.douglas@outlook.com',
    subject:'test',
    text:'test nodemailer'
}

mailtransport.sendMail(mail,(mailerror,sentmailresponse)=>{
    if(mailerror) return console.log('nodemailer send mail error: ',mailerror.message);
    console.log('mail sent successfully: ',sentmailresponse);
})