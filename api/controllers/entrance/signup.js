module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    email: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    firstName:  {
      required: true,
      type: 'string'
    },

    lastName:  {
      required: true,
      type: 'string'
    },

    dataExtra:  {
      required: true,
      type: 'json'
    },
    
    role: {
      required: true,
      type: 'json'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusemail: 409,
      description: 'The provided email address is already in use.',
    },

    notPermiss: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: 'You do not have permission to create this user'
    }

  },


  fn: async function (inputs, exits) {

    var newEmailAddress = inputs.email.toLowerCase();

    //Para generar el email aleatorio
    var randomize = require('randomatic');
    let code = randomize('0', 4);

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create({
      email: newEmailAddress,
      password: await sails.helpers.passwords.hashPassword(inputs.password),
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      role: inputs.role,
      dataExtra: inputs.dataExtra,
      verified: false,
      code,
      status: ""
    }).fetch();
    console.log(newUserRecord)

    await require("./../../../mailer").registerUserRevision(newUserRecord.email);
    await require("./../../../mailer").newUserNotification(newUserRecord.firstName, newUserRecord.lastName, newUserRecord.role, newUserRecord.email);
    

    // Since everything went ok, send our 200 response.
    return exits.success(newUserRecord);

  }

};
