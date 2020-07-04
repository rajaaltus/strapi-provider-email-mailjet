'use strict';

const mailjetFactory = require ('node-mailjet');
const { removeUndefined } = require('strapi-utils');

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    const mailjet = mailjetFactory.connect(providerOptions.apiKey, providerOptions.secretKey);

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;

          const details = {
            'Globals': {
              ReplyTo: replyTo || settings.defaultReplyTo,
            },
            'Messages': [{
              'From': {
                'Email': from || settings.defaultFrom,
              },
              'To': [{
                'Email': to,
              }],
              'Cc': [{
                'Email': cc,
              }],
              'Bcc': [{
                'Email': bcc,
              }],
              'Subject': subject,
              'TextPart': text,
              'HTMLPart': html,
            }],
            ...rest,
          };

          mailjet.post('send', {'version': 'v3.1'})
            .request(removeUndefined(details))
            .then(resolve)
            .catch(err => reject(err));
        });
      },
    };
  },
};
