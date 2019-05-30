const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const IMAGES = path.join(path.resolve(__dirname, '../../../images/'), "/company");
const rimraf = require("rimraf");
var mmm = require('mmmagic'),
  Magic = mmm.Magic;

const writeImage = async function (nameFile, directory, image) {
  return new Promise(function (resolve, reject) {

    fs.writeFile(path.join(directory, nameFile), image, function (err) {

      if (err) {
        return reject(err);
      }

      resolve({ message: "success" });

    });

  });
}

const resizeSave = async function (nameFile, directory, image, size) {

  return new Promise(function (resolve, reject) {

    sharp(image).resize(size.width, size.height)
      .crop(sharp.strategy.entropy)
      .toBuffer(async function (err, data, info) {
        if (err) { return reject(err); }

        try {
          let write = await writeImage(nameFile, directory, data);
          resolve(directory, data, info, true);
        }
        catch (e) {
          reject(e);
        }

      });

  });
}

const saveStore = require("./../StoreController").save;

if (!fs.existsSync(IMAGES)) {
  fs.mkdirSync(IMAGES);
}

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

    firstName: {
      required: true,
      type: 'string'
    },

    lastName: {
      required: true,
      type: 'string'
    },

    dataExtra: {
      required: true,
      type: 'json'
    },

    role: {
      required: true,
      type: 'json'
    },

    logoCompany: {
      type: "string",
      required: false
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request ' +
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


    console.log(newUserRecord, inputs.role)
    //for user is seller (role = 1)
    let store, req = this.req, res = this.res;
    if (inputs.role === 1) {
      store = await new Promise(function (resolve, reject) {
        let _res = {}, _req = {};
        _req.param = function (id) { if (id === "owner") return newUserRecord.id; else return req.param(id); };
        _req.file = req.file;
        _res.json = resolve;
        _res.serverError = reject;
        saveStore(_req, _res);
      });

      //If there a error delete user new
      if (store.message && store.message === "error") {
        await User.destroy({ id: newUserRecord.id });
        return exits.success(store);
      }

    }

    if (inputs.role === 1)
      newUserRecord.store = store;

    if (inputs.logoCompany !== undefined) {
      let base64 = inputs.logoCompany.replace(/^data:image\/jpeg;base64,/, "");
      base64 = base64.replace(/^data:image\/png;base64,/, "");
      var image = new Buffer(base64, 'base64');
      let directory = path.join(IMAGES, newUserRecord.id);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }

      await resizeSave("logo-small.jpg", directory, image, { width: 50, height: 50 });
      await writeImage("logo.jpg", directory, image);
      let users = await User.update({ id: newUserRecord.id }, { logoCompany: `/api/logo-company/${newUserRecord.id}` }).fetch();
      console.log(users);
      if (users.length === 1)
        newUserRecord = users[0];
    }


    await MailerService.registerNewUser(newUserRecord);
    let nameCompany = inputs.dataExtra.companyName || "not have"
    await MailerService.newUserNotification(inputs.firstName + " " + inputs.lastName, newEmailAddress, newUserRecord.role, nameCompany);
    //await require("./../../../mailer").newUserNotification(newUserRecord.firstName, newUserRecord.lastName, newUserRecord.role, newUserRecord.email);


    // Since everything went ok, send our 200 response.
    return exits.success(newUserRecord);

  }

};
