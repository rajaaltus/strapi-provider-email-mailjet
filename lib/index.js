'use strict';

const mailjetFactory = require ('node-mailjet');

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    const mailjet = mailjetFactory.connect(providerOptions.apiKey, providerOptions.secretKey);

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          const { to, cc, bcc, replyTo, subject, text, html, ...rest } = options;

          const details = {
            Messages: [{
              Subject: subject,
              From: {
                Email: settings.defaultFrom,
              },
              replyTo: {
                Email: replyTo || settings.defaultReplyTo,
              },
              To: [{
                Email: to,
              }],
              ...(cc && {
                Cc: [{
                  Email: cc,
                }],
              }),
              ...(bcc && {
                Bcc: [{
                  Email: bcc,
                }],
              }),
              ...(text && {
                TextPart: text,
              }),
              ...(html && {
                HTMLPart: html,
              }),
            }],
            ...rest,
          };

          mailjet.post('send', {
            version: 'v3.1'
          })
            .request(details)
            .then(resolve)
            .catch(err => {console.log(err); reject(err);});
        });
      },
    };
  },
};
