/**
*   This file is part of email-sender.
*
*   email-sender is free software: you can redistribute it and/or modify
*   it under the terms of the GNU Lesser General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   email-sender is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU Lesser General Public License for more details.
*
*   You should have received a copy of the GNU Lesser General Public License
*   along with email-sender.  If not, see <https://www.gnu.org/licenses/>.
*/

const config = require('config');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const { Email, validate } = require('../models/email');
const express = require('express');
const router = express.Router();
const debug = require('debug')('emails');


const transportOptions = {
    host: config.get('emails.smtp.host'),
    port: config.get('emails.smtp.port'),
    secure: config.get('emails.smtp.secure'),
};

if(config.get('emails.smtp.auth.username')) {
    transportOptions.auth = {
        user: config.get('emails.smtp.auth.username'),
        pass: config.get('emails.smtp.auth.password')
    };
}

debug(_.omit(transportOptions, ['auth.pass']));

router.get('/', async (req, res) => {
    const emails = await Email.find().sort({ _id: -1 });
    res.send(emails);
});

router.get('/:id', async (req, res) => {
    const email = await Email.findById(req.params.id);

    if(!email) return res.status(404).send('Email with the given ID is not found');

    res.send(email);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const email = new Email(_.pick(req.body, ["from", "to", "cc", "bcc", "subject", "text", "html"]));
    debug(email);

    // send mail with defined transport object
    const sendMail = (email) => new Promise((resolve, reject) => {

        const mail = {
            from: email.from,
            to: email.to.join(','),
            cc: email.cc.join(','),
            bcc: email.bcc.join(','),
            subject: email.subject,
            text: email.text,
            html: email.html
        };

        const transporter = nodemailer.createTransport(transportOptions);

        transporter.sendMail(mail, (error, info) => {
            error ? reject(error) : resolve(info);
        });
    });

    await sendMail(email)
        .then(async result => { email.result = result; })
        .catch(async error => { email.error = error; });

    await email.save();
    res.send(email);
});

router.delete('/:id', async (req, res) => {
    const email = await Email.findByIdAndRemove(req.params.id);
    if(!email) return res.status(404).send('Email with the given ID is not found');

    res.send(email);
});

module.exports = router;
